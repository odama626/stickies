import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import Koa from "koa";
import KoaBody from "koa-body";
import cors from "@koa/cors";
import { createServer } from "node:http";

import apiV1 from "api/v1/index";
import { AppContext } from "./interfaces";
import errorHandler from "middleware/errorHandler";
import { Server } from "socket.io";

const app = new Koa<{}, AppContext>();

app.context.db = new PrismaClient();

app.use(
  cors({
    credentials: "Access-Control-Allow-Credentials",
  })
);
app.use(KoaBody());

app.use(errorHandler());

app.use(apiV1.routes());

// function PWCAdapter(prisma: PrismaClient, prefix = "/api/pwc") {
//   const prismaWebClient = new Router();

//   prismaWebClient.post(`${prefix}/:model/:action`, async (ctx) => {
//     ctx.body = await prisma[ctx.params.model][ctx.request.body.action](ctx.request.body.payload);
//   });

//   return prismaWebClient.routes();
// }

// app.use(PWCAdapter(app.context.db));

const server = createServer(app.callback());
const io = new Server(server, {
  cors: {
    origin: process.env.SITE_BASE_URL,
    methods: ["GET", "POST"],
  },
});
app.context.io = io;

io.on("connection", (socket) => {
  socket.on("subscribe", (model, id) => {
    socket.join(`${model}:${id}`);
  });
  socket.on("unsubscribe", (model, id) => {
    socket.leave(`${model}:${id}`);
  });
});

server.listen(3050);
