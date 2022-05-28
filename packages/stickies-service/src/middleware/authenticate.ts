import jwt from 'jsonwebtoken';
import { UnauthorizedError } from 'lib/errors';
import { AppContext, AuthTokenContent } from 'src/interfaces';

export default function authenticate(config = {}) {
  return async (ctx: AppContext, next: Function) => {
    try {
      const token = ctx.cookies.get("Authorization")?.slice('Bearer '.length);
      const payload = jwt.verify(token, process.env.USER_TOKEN_SECRET || '') as unknown as AuthTokenContent;
      const user = await ctx.db.user.findFirst({ where: { email: payload.email.toLowerCase()}, include: { usersOnBoards: { include: { board: true}}}});
      ctx.state.user = user;
    } catch(e) {
      throw new UnauthorizedError();  
    }
    return await next();
  };
}
