export type MaybePromise<T> = Promise<T> | T;
import * as mockttp from "mockttp";

export interface Headers {
  [key: string]: string[] | string | undefined;
  host?: string;
  "content-length"?: string;
  "content-type"?: string;
  "user-agent"?: string;
  cookie?: string;
  ":method"?: string;
  ":scheme"?: string;
  ":authority"?: string;
  ":path"?: string;
}

export interface Request {
  id: string;
  matchedRuleId?: string;
  protocol: string;
  httpVersion?: string;
  method: string;
  url: string;
  path: string;
  hostname?: string;
  headers: Headers;
  tags: string[];
}

export interface CompletedBody {
  buffer: Buffer;
  decodedBuffer: Buffer | undefined;
  getDecodedBuffer: () => Promise<Buffer | undefined>;
  text: string | undefined;
  getText: () => Promise<string | undefined>;
  json: unknown;
  getJson: () => Promise<unknown>;
  formData: Record<string, string[] | string | undefined> | undefined;
  getFormData: () => Promise<Record<string, string[] | string | undefined> | undefined>;
}

export interface PassThroughResponse {
  id: string;
  statusCode: number;
  statusMessage?: string;
  headers: Headers;
  body: CompletedBody;
}

export interface CallbackResponseResult {
  statusCode?: number;
  status?: number;
  statusMessage?: string;
  headers?: Headers;
  json?: unknown;
  body?: Buffer | Uint8Array | string;
}

export interface CallbackRequestResult {
  method?: string;
  url?: string;
  headers?: Headers;
  json?: unknown;
  body?: Buffer | string;
  response?: CallbackResponseResult;
}

export type TStoredRequest = mockttp.CompletedRequest & { id: string };

export type TRule = {
  match: (_: mockttp.CompletedRequest) => boolean;
  beforeRequest?: (request: TStoredRequest) => MaybePromise<CallbackRequestResult>;
  beforeResponse?: (
    request: TStoredRequest,
    response: mockttp.requestHandlers.PassThroughResponse
  ) => MaybePromise<CallbackResponseResult>;
};
