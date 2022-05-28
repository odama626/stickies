import { AppContext } from "src/interfaces";
import JsonURL from '@jsonurl/jsonurl';

export default function parseJsonURL(params: string | string[]) {
  let arrParams = Array.isArray(params) ? params : [params];

  return (ctx: AppContext, next: Function) => {
    arrParams.forEach((param) => {
      ctx.params[param] = JsonURL.parse(ctx.params[param]);
    });
    return next();
  };
}
