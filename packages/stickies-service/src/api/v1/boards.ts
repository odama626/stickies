import Router from "@koa/router";
import { Board, Prisma } from "@prisma/client";
import generateMagicLink from "lib/generateMagicLink";
import getDefaultName from "lib/getDefaultName";
import sendEmail from "lib/sendEmail";
import authenticate from "middleware/authenticate";
import { AppContext } from "src/interfaces";

const router = new Router<{}, AppContext>();

router.use(authenticate());

const include = {
  usersOnBoards: {
    include: {
      user: {
        select: {
          name: true,
          email: true,
          id: true,
        },
      },
    },
  },
};

router.get("/", async (ctx) => {
  const result = await ctx.db.board.findMany({
    where: {
      usersOnBoards: {
        some: {
          userId: ctx.state.user.id,
        },
      },
    },

    orderBy: { updatedAt: "desc" },
  });
  ctx.body = result;
});

router.get("/:id", async (ctx) => {
  ctx.body = await ctx.db.board.findFirst({
    where: { id: ctx.params.id },
    include,
  });
});

async function updateUsersOnBoards(ctx: AppContext, board: Board, usersOnBoards: any[]) {
  // TODO: enforce permissions

  if (!usersOnBoards?.length) return;

  const results = await Promise.all(
    usersOnBoards
      ?.filter((relation) => relation.user.id !== ctx.state.user.id)
      .map(async (relation) =>
        ctx.db.usersOnBoards.upsert({
          where: {
            boardId_userId: {
              userId: relation.user.id || "",
              boardId: board.id,
            },
          },
          create: {
            user: {
              connectOrCreate: {
                where: { id: relation.user.id || "" },
                create: {
                  email: relation.user.email,
                  name: getDefaultName(relation.user.email),
                  magicLink: await generateMagicLink(relation.user.email),
                },
              },
            },
            board: {
              connect: {
                id: board.id,
              },
            },
            permission: relation.permission,
          },
          update: {
            permission: relation.permission,
          },
          include: include.usersOnBoards.include,
        })
      )
  );

  await Promise.all(
    results.map((relation) =>
      sendEmail({
        email: relation.user.email,
        data: {
          url: `${process.env.SITE_BASE_URL}/boards/${board.id}?email=${relation.user.email}`,
          urlText: "Check it out!",
          message: `You've been invited to join ${board.name} by ${ctx.state.user.name}`,
          subject: `You've been invited to a Stickies board`,
        },
      })
    )
  );
}

router.post("/:id", async (ctx) => {
  const { record } = ctx.request.body;
  delete record.tagIds;
  delete record.taskIds;
  delete record.updatedAt;

  const usersOnBoards = record.usersOnBoards;
  delete record.usersOnBoards;

  const result = await ctx.db.board.upsert({
    where: { id: ctx.params.id },
    create: {
      ...record,
      usersOnBoards: {
        connectOrCreate: {
          where: {
            boardId_userId: {
              userId: ctx.state.user.id,
              boardId: record?.id || "",
            },
          },
          create: {
            user: {
              connect: {
                id: ctx.state.user.id,
              },
            },
            permission: "owner",
          },
        },
      },
    },
    update: record,
  });

  await updateUsersOnBoards(ctx, result, usersOnBoards);

  const payload = await ctx.db.board.findFirst({
    where: { id: result.id },
    include,
  });

  ctx.io.in(`board:${payload?.id}`).emit('board','upsert', payload)
  ctx.body = payload;
});

export default router;
