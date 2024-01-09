import path from "path";
import type { Config } from "./types";

const DEFAULT_PROFILE_PATH = path.join(process.cwd(), "devproxy_profile");

export const buildConfig = (config: Partial<Config>): Config => {
  return {
    chromiumBinary: config.chromiumBinary ?? "google-chrome-stable",
    open: config.open ?? "https://github.com/3rd/devproxy",
    port: config.port, // undefined = auto
    rules: config.rules ?? [],
    ws: {
      enabled: true,
      forward: {},
      ...config.ws,
    },
    fresh: config.fresh ?? false,
    profilePath: config.profilePath ?? DEFAULT_PROFILE_PATH,
  } satisfies Config;
};
