import child_process from "child_process";
import * as mockttp from "mockttp";
import type { Config, Request } from "./types";

export class Proxy {
  config: Config;
  requests: Record<string, Request> = {};
  port = 0;
  fingerprint = "";

  constructor(config: Config) {
    this.config = config;
  }

  async start() {
    const https = await mockttp.generateCACertificate();
    const server = mockttp.getLocal({
      https,
      http2: "fallback",
      recordTraffic: false,
    });

    if (this.config.ws.enabled) {
      if (Object.keys(this.config.ws.forward).length > 0) {
        for (const [from, to] of Object.entries(this.config.ws.forward)) {
          server.forAnyWebSocket().forHostname(from).thenForwardTo(to);
        }
      } else {
        server.forAnyWebSocket().thenPassThrough();
      }
    }

    server.forAnyRequest().thenPassThrough({
      beforeRequest: (request: mockttp.CompletedRequest) => {
        this.storeRequest(request);
        const rules = this.getMatchingRules(request.id).filter((rule) => rule.beforeRequest);
        if (rules.length === 0) return {};
        if (rules.length !== 1) {
          throw new Error("Fatal: more than one matching beforeRequest rule.");
        }
        return rules[0]?.beforeRequest?.(this.requests[request.id]) ?? {};
      },
      beforeResponse: async (response: mockttp.requestHandlers.PassThroughResponse) => {
        const beforeResponseRules = this.getMatchingRules(response.id).filter((rule) => rule.beforeResponse);
        if (beforeResponseRules.length === 0) return {};
        if (beforeResponseRules.length !== 1) {
          throw new Error("Fatal: more than one matching beforeResponse rule.");
        }

        const request = this.requests[response.id];

        // forgive me master for i have sinned
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.requests[response.id];

        return beforeResponseRules[0]?.beforeResponse?.(request, response) ?? {};
      },
    });

    await server.start(this.config.port);
    this.port = server.port;
    this.fingerprint = mockttp.generateSPKIFingerprint(https.cert);
  }

  storeRequest(request: mockttp.CompletedRequest) {
    this.requests[request.id] = request;
  }

  getMatchingRules(requestId: string) {
    const request = this.requests[requestId];
    return this.config.rules.filter((rule) => rule.match(request));
  }

  spawnChromium() {
    const command = this.config.chromiumBinary;
    const args = [
      `--disable-web-security`,
      `--proxy-server=127.0.0.1:${this.port}`,
      `--ignore-certificate-errors-spki-list=${this.fingerprint}`,
      `--user-data-dir=${this.config.profilePath}`,
      `--proxy-bypass-list=<-loopback>`,
      this.config.open,
    ];

    console.log("Launching", command, args);
    child_process.spawn(command, args);
  }
}
