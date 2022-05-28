import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import { prisma } from 'prisma/client';

interface Context<T, S> {
  req: NextApiRequest;
  res: NextApiResponse<T>;
  local: S;
}
type RouterFunc = <T, S>(ctx: Context<any, S>, next: () => {}) => any | void;

export default class Router {
  middleware = [];

  use = (callback: RouterFunc) => {
    this.middleware.push({ type: 'use', callback });
    return this;
  };

  get = (callback: RouterFunc) => {
    this.middleware.push({ type: 'get', callback });
    return this;
  };

  post = (callback: RouterFunc) => {
    this.middleware.push({ type: 'post', callback });
    return this;
  };

  delete = (callback: RouterFunc) => {
    this.middleware.push({ type: 'delete', callback });
    return this;
  };

  put = (callback: RouterFunc) => {
    this.middleware.push({ type: 'put', callback });
    return this;
  };

  getAll = (callback: RouterFunc) => {
    this.middleware.push({ type: 'getAll', callback });
    return this;
  };

  postAll = (callback: RouterFunc) => {
    this.middleware.push({ type: 'postAll', callback });
    return this;
  };

  putAll = (callback: RouterFunc) => {
    this.middleware.push({ type: 'putAll', callback });
    return this;
  };

  deleteAll = (callback: RouterFunc) => {
    this.middleware.push({ type: 'deleteAll', callback });
    return this;
  };

  connect = async (req: NextApiRequest, res: NextApiResponse) => {
    const ctx = { req, res, local: {} };
    const postfix = req?.query?.id ? '' : 'All';
    const method = req.method.toLowerCase() + postfix;

    let i = 0;

    const next = async () => {
      let fn = this.middleware[i];
      i++;

      while (fn && fn.type !== 'use' && fn.type !== method) {
        fn = this.middleware[i];
        i++;
      }

      if (!fn) {
        console.log({ method });
        return;
      }

      if (fn.type === 'use' || fn.type === method) {
        await fn.callback(ctx, next);
      }
    };

    await next();
  };
}

export async function auth({ local, req, res }, next) {
  try {
    const cookies = new Cookies(req, res);
    const token = cookies.get('Authorization').substr('Bearer '.length);
    const payload = jwt.verify(token, process.env.USER_TOKEN_SECRET);
    const user = await prisma.user.findFirst({
      // TODO: should magicLink: token be included in where clause?
      where: { email: payload.email.toLowerCase() },
      include: { usersOnBoards: { include: { board: true } } },
    });

    local.user = user;
    return next();
  } catch (e) {
    console.log(`user not authenticated`, e);
    res.status(401).send('Unauthorized');
  }
}
