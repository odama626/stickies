import { AppContext } from "src/interfaces";

export default function errorHandler() {
  return async (ctx: AppContext, next: Function) => {
    try {
      await next();
    } catch (e: any) {
      console.error(e);
      e.status = e.statusCode || e.status || 500;
      ctx.body = { message: e.message, status: e.status };
      ctx.status = e.status;
    }
  };
}
