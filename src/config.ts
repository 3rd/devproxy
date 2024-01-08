import path from "path";
import type { TRule } from "./types";

const DEFAULT_PROFILE_PATH = path.join(process.cwd(), "devproxy_profile");

interface IConfig {
  chromiumBinary: string;
  fresh: boolean;
  openUrl: string;
  port: number;
  rules: TRule[];
  ws: {
    enabled: boolean;
    forward: Record<string, string>;
  };
  profilePath: string;
}

class Config implements IConfig {
  chromiumBinary = "chromium";
  fresh = false;
  openUrl = "";
  port = 0; // auto
  rules: TRule[] = [];
  ws: { enabled: boolean; forward: Record<string, string> } = {
    enabled: true,
    forward: {},
  };
  profilePath: string;

  constructor({ chromiumBinary, fresh, port, openUrl, rules, ws, profilePath }: Partial<IConfig>) {
    if (chromiumBinary) this.chromiumBinary = chromiumBinary;
    if (fresh) this.fresh = fresh;
    if (openUrl) this.openUrl = openUrl;
    if (port) this.port = port;
    if (rules) this.rules = rules;
    if (ws) this.ws = ws;
    if (profilePath) this.profilePath = profilePath;
    else this.profilePath = DEFAULT_PROFILE_PATH;
  }
}

export type { IConfig };
export default Config;
