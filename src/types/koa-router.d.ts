declare module "@koa/router" {
  export default class Router {
    get(path: string, middleware: (...args: unknown[]) => unknown): this;
    post(path: string, middleware: (...args: unknown[]) => unknown): this;
    routes(): (...args: unknown[]) => unknown;
    allowedMethods(): (...args: unknown[]) => unknown;
  }
}
