import { Command } from "commander";
import { resolve } from "path";
import type { Config } from "./types";
import { buildConfig } from "./config";
import { Proxy } from "./proxy";
import { canAccessFile } from "./util";

const options: [string, string, string?, boolean?][] = [
  ["-c, --config <config>", "config file", "config.js", true],
  ["-p, --port <port>", "custom proxy port"],
  ["--chromium-binary <chromium-binary>", "specify chromium binary"],
  ["-o, --open <url>", "open url"],
  ["--disable-web-security <boolean>", "enable/disable web security", "false"],
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

  const fileConfig: Partial<Config> = require(resolve(process.cwd(), opts.config));

  const config = buildConfig({
    open: opts.open ?? fileConfig.open,
    chromiumBinary: opts.chromiumBinary ?? fileConfig.chromiumBinary,
    port: opts.port ?? fileConfig.port,
    rules: fileConfig.rules,
    ws: {
      enabled: Boolean(fileConfig.ws?.enabled),
      forward: fileConfig.ws?.forward ?? {},
    },
    profilePath: fileConfig.profilePath,
    disableWebSecurity: opts.disableWebSecurity === "true",
  });

  const proxy = new Proxy(config);

  await proxy.start();
  console.log(`Proxy up on port: ${proxy.port}`);
  console.log(`Cert fingerprint: ${proxy.fingerprint}`);

  if (config.open) proxy.spawnChromium();
};

export default { run };
