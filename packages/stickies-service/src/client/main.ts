import { Prisma, PrismaClient } from "@prisma/client";

interface PrismaWebClientOptions {
  baseUrl: string;
  request: any;
}

function createActionProxy(request) {
  return {
    get(_, action: Prisma.PrismaAction) {
      return (body: any) => request({ action, body });
    },
  };
}

function createModelProxy(request) {
  return {
    get(_, model: Prisma.ModelName) {
      return new Proxy<{ [key in Prisma.PrismaAction]: Function }>(
        {},
        createActionProxy((payload) => request({ model, ...payload }))
      );
    },
  };
}

export function createUrl({ baseUrl, model, action, body }) {
  const url = `${baseUrl}/${model}/${action}`.toLowerCase();
  return url;
}

function defaultRequest(args) {
  const url = createUrl(args);
  console.log({ url });
  return fetch(url, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: args.action, payload: args.body }),
  })
    .then((r) => {
      if (!r.ok) throw r;
      return r;
    })
    .then((r) => r.json());
}


type FilterNotStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? never : Set

export default function createPrismaWebClient({
  baseUrl,
  request = defaultRequest,
}: PrismaWebClientOptions): FilterNotStartingWith<PrismaClient, '$'> {
  const proxy = new Proxy<PrismaClient>(
    {},
    createModelProxy((payload) => request({ baseUrl, ...payload }))
  );
  return proxy;
}
