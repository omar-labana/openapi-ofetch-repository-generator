export type XGenerator = string;

export type OpenAPIVersion = '3.0.0';

export interface Info {
  title: string;
  version: string;
}

export interface Server {
  url: string;
}

export type Servers = Server[];

export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'options'
  | 'trace'
  | 'connect';

export interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: Array<{
    name: string;
    in: 'query' | 'path';
    schema: {
      type?: string;
      nullable?: boolean;
    };
  }>;
  requestBody?: {
    'x-name'?: string;
    description?: string;
    content: {
      [media: string]: {
        schema: {
          $ref: string;
        };
      };
    };
    required?: boolean;
    'x-position'?: number;
  };
  responses: {
    [status: string]: {
      description: string;
      content?: {
        [media: string]: {
          schema: {
            $ref: string;
          };
        };
      };
    };
  };
  security?: Array<Record<string, unknown[]>>;
}

export type Path = Record<HttpMethod, Operation>;

export type Paths = Record<string, Path>;

export interface Document {
  'x-generator': XGenerator;
  openapi: OpenAPIVersion;
  info: Info;
  servers: Servers;
  paths: Paths;
}

export interface NormalizedOperation {
  method: HttpMethod;
  path: string;
  summary: string;
  description: string;
  operationId: string;
  function: string;
  payload: string;
  returns: string;
  parameters: Operation['parameters'];
  requestBody?: Operation['requestBody'];
}

export interface Normalized {
  repository: string;
  operations: NormalizedOperation[];
}

/**
 * Custom error types for better error handling
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class FetchError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'FetchError';
  }
}

export class FileSystemError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'FileSystemError';
  }
}
