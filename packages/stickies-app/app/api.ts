import wretch from "wretch";
import Router from "next/router";
import { queryFromObj } from "./string";
import notify from "./notify";
import createPrismaWebClient, { createUrl } from 'stickies-service';

function req(args) {
  const url = createUrl(args)
  const body = args.body;
  console.log({ url, body })
}


// type FilterNotStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? never : Set
// const pwc = createPrismaWebClient({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/pwc`}) as FilterNotStartingWith<PrismaClient, '$'>;
// export { pwc }


  export const externalApi = wretch()
  .url(process.env.NEXT_PUBLIC_API_URL +"/api/v1")
  .options({ credentials: "include", mode: "cors" })
  .resolve((_) =>
    _.unauthorized(() => {
      console.log(Router.pathname);
      if (Router.pathname === "/account/login") return;
      const search = queryFromObj({
        ...Router.query,
        return: Router.pathname,
      });
      Router.push(`/account/login?${search}`);
    })
      .internalError((e) => {
        console.error(e);
        notify.error(e.message);
      })
      .notFound(notify.netError)
  );



// export default internalApi;

