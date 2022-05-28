import Router from "@koa/router";
import sendEmail from "lib/sendEmail";
import { BadRequestError, UnauthorizedError } from "lib/errors";
import generateMagicLink from "lib/generateMagicLink";
import getDefaultName from "lib/getDefaultName";
import queryFromObj from "lib/queryFromObj";
import { AppContext } from "src/interfaces";
import authenticate from "middleware/authenticate";

const router = new Router<{}, AppContext>();

router.post("/", async (ctx) => {
  const email = ctx.request.body.email.toString().toLowerCase();

  if (!email) throw new BadRequestError("Email is Required");
  if (!/^(.+)@(.+)$/.test(email)) throw new BadRequestError("Email is invalid");

  const magicLink = generateMagicLink(email);

  await ctx.db.user.upsert({
    where: { email },
    create: { email, magicLink, name: getDefaultName(email) },
    update: { magicLink },
  });

  const magicLinkUrl = new URL("/account/login", process.env.SITE_BASE_URL);
  magicLinkUrl.searchParams.set("magic", magicLink);

  await sendEmail({
    email,
    data: {
      url: magicLinkUrl.toString(),
      subject: "Stickies Magic Link",
      urlText: "Login",
      message: "Login to Stickies",
    },
  });

  const redirectUrl = new URL(
    `/account/login?${queryFromObj({
      ...ctx.query,
      sent: true,
      email,
    })}`,
    process.env.SITE_BASE_URL
  );

  console.log('redirect to', redirectUrl.toString())

  ctx.redirect(redirectUrl.toString());
});

router.use(authenticate());

router.post("/logout", (ctx: AppContext) => {
  ctx.cookies.set("Authorization");
  ctx.status = 200;
});

router.get("/", (ctx: AppContext) => {
  try {
    let sanitizedUser: any = {};
    ["name", "email", "id", "createdAt", "updatedAt"].forEach(
      (key) => (sanitizedUser[key] = ctx.state.user[key])
    );
    ctx.body = sanitizedUser;
  } catch (e) {
    throw new UnauthorizedError();
  }
});

export default router;
