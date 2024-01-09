export type MaybePromise<T> = Promise<T> | T;
import * as mockttp from "mockttp";

export type Config = {
  chromiumBinary: string;
  fresh: boolean; // TODO: implement kill + mktemp + launch
  open: string;
  rules: Rule[];
  ws: {
    enabled: boolean;
    forward: Record<string, string>;
  };
  profilePath: string;
  port?: number;
};

export type Headers = {
  [key: string]: string[] | string | undefined;
  host?: string;
  ["content-length"]?: string;
  ["content-type"]?: string;
  ["user-agent"]?: string;
  cookie?: string;
  [":method"]?: string;
  [":scheme"]?: string;
  [":authority"]?: string;
  [":path"]?: string;
};

export type CompletedBody = {
  buffer: Buffer;
  decodedBuffer: Buffer | undefined;
  getDecodedBuffer: () => Promise<Buffer | undefined>;
  text: string | undefined;
  getText: () => Promise<string | undefined>;
  json: unknown;
  getJson: () => Promise<unknown>;
  formData: Record<string, string[] | string | undefined> | undefined;
  getFormData: () => Promise<Record<string, string[] | string | undefined> | undefined>;
};

export type CallbackResponseResult = {
  statusCode?: number;
  status?: number;
  statusMessage?: string;
  headers?: Headers;
  json?: unknown;
  body?: Buffer | Uint8Array | string;
};

export type CallbackRequestResult = {
  method?: string;
  url?: string;
  headers?: Headers;
  json?: unknown;
  body?: Buffer | string;
  response?: CallbackResponseResult;
};

export type Request = mockttp.CompletedRequest & { id: string };

export type Rule = {
  match: (_: mockttp.CompletedRequest) => boolean;
  beforeRequest?: (request: Request) => MaybePromise<CallbackRequestResult>;
  beforeResponse?: (
    request: Request,
    response: mockttp.requestHandlers.PassThroughResponse
  ) => MaybePromise<CallbackResponseResult>;
};
