import Router from "@koa/router";
import { Prisma, Tag } from "@prisma/client";
import parseJsonurl from "middleware/parseJsonURL";
import { AuthAppContext } from "src/interfaces";

const router = new Router<{}, AuthAppContext>();

router.get("/board/:boardId", async (ctx) => {
  ctx.body = await ctx.db.tag.findMany({
    where: { boardId: ctx.params.boardId },
    orderBy: { name: "asc" },
  });
});

router.get("/find/:query", parseJsonurl("query"), async (ctx) => {
  ctx.body = await ctx.db.tag.findMany(ctx.params.query as Prisma.TagFindManyArgs);
});

router.post("/", async (ctx) => {
  const record = ctx.body.record as Tag;

  const payload = await ctx.db.tag.upsert({
    where: { id: ctx.body.id || "" },
    create: record,
    update: record,
  });
  ctx.io.in(`board:${payload.boardId}`).emit("tag", "upsert", [payload]);
  ctx.body = payload;
});

router.del("/:id", async (ctx) => {
  const payload = await ctx.db.tag.delete({ where: { id: ctx.params.id } });
  ctx.io.in(`board:${payload.boardId}`).emit('tag', 'delete', [payload])
  ctx.body = payload;
});

export default router;
