import Router from "@koa/router";
import { Task } from "@prisma/client";
import authenticate from "middleware/authenticate";
import { AppContext, AuthAppContext } from "src/interfaces";

// TODO: make color schemes and things like it a 3rd package that can be shared and bundled seprately
const COLOR_SCHEMES = {
  tags: [
    "#0adade",
    "#0f8157",
    "#0f4c81",
    "#7506a4",
    "#c7076b",
    "#ee6e07",
    "#ffc90b",
    "#A8A8A8",
    "#8787D7",
    "#5A4D41",
  ],
};

const include = {
  tagsOnTasks: {
    include: {
      tag: true,
    },
  },
  createdBy: {
    select: {
      name: true,
      email: true,
    },
  },
};

const router = new Router<{}, AuthAppContext>();

router.use(authenticate());

router.get(`/board/:boardId`, async (ctx) => {
  ctx.body = await ctx.db.task.findMany({
    where: { boardId: ctx.params.boardId },
    orderBy: { updatedAt: "desc" },
    include,
  });
});

async function updateTagsForTask(ctx: AuthAppContext, task: Task) {
  const tagNames = Array.from((task.content || "").matchAll(/\#([\w\-\_]+)/g)).map((r) => r[1]);
  const colors = COLOR_SCHEMES.tags;
  const boardId = task.boardId;

  // delete any connections to removed tags
  if (task.id) {
    await ctx.db.tagsOnTasks.deleteMany({
      where: {
        taskId: task.id,
        tag: {
          name: {
            notIn: tagNames,
          },
        },
      },
    });
  }

  await Promise.all(
    tagNames.map((name) =>
      ctx.db.tagsOnTasks
        .create({
          data: {
            tag: {
              connectOrCreate: {
                where: { name_boardId: { boardId, name } },
                create: { boardId, name, color: colors[(Math.random() * colors.length) | 0] },
              },
            },
            task: {
              connect: { id: task.id },
            },
            board: {
              connect: {
                id: boardId,
              },
            },
          },
        })
        .catch(() => {})
    )
  );
}

router.post("/:id", async (ctx) => {
  const { record } = ctx.request.body;

  const boardId = record.boardId;

  delete record.boardId;
  delete record.userId;
  delete record.updatedAt;

  const result = await ctx.db.task.upsert({
    where: { id: record?.id ?? "" },
    create: {
      ...record,
      board: {
        connect: { id: boardId },
      },
      createdBy: {
        connect: { id: ctx.state.user.id },
      },
    },
    update: record,
  });

  await updateTagsForTask(ctx, result);

  const payload = await ctx.db.task.findFirst({ where: { id: result.id }, include });
  ctx.io.in(`board:${boardId}`).emit("task", "upsert", payload); 
  ctx.body = payload;
});

export default router;
