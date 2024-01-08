import { Command } from "commander";
import { resolve } from "path";
import Config from "./config";
import Proxy from "./proxy";
import { canAccessFile } from "./util";
import type { TRule } from "./types";

type TFileConfig = {
  open?: string;
  port?: number;
  chromiumBinary?: string;
  rules?: TRule[];
  ws?: { enabled: boolean; forward?: Record<string, string> };
  profilePath?: string;
};

const options: [string, string, string?, boolean?][] = [
  ["-c, --config <config>", "config file", "config.js", true],
  ["-p, --port <port>", "custom proxy port"],
  ["--chromium-binary <chromium-binary>", "specify chromium binary"],
  ["-o, --open <url>", "open url"],
];

const run = async () => {
  const program = new Command();
  for (const option of options) {
    const [flag, description, defaultValue, isRequired] = option;
    if (isRequired) program.requiredOption(flag, description, defaultValue);
    else program.option(flag, description, defaultValue);
  }
  program.parse(process.argv);
  const opts = program.opts();

  if (!canAccessFile(opts.config)) {
    throw new Error(`Unable to access config file: ${opts.config as string}`);
  }

  const fileConfig: TFileConfig = require(resolve(process.cwd(), opts.config));

  const config = new Config({
    openUrl: opts.open ?? fileConfig.open,
    chromiumBinary: opts.chromiumBinary ?? fileConfig.chromiumBinary,
    port: opts.port ?? fileConfig.port,
    rules: fileConfig.rules,
    ws: {
      enabled: Boolean(fileConfig.ws?.enabled),
      forward: fileConfig.ws?.forward ?? {},
    },
    profilePath: fileConfig.profilePath,
  });

  const proxy = new Proxy(config);

  await proxy.start();
  console.log(`Proxy up on port: ${proxy.port}`);
  console.log(`Cert fingerprint: ${proxy.fingerprint}`);

  if (config.openUrl) proxy.spawnChromium();
};

export default { run };
