export interface ActionCreatorOptions {
  queryParams?: unknown;
  queryStringParams?: unknown;
  onSuccess?: (...args: any) => void;
  onError?: (...args: any) => void;
}
