import { PrismaClient } from "@prisma/client";
import Application from "koa";

export interface AppContext extends Application.Context {
  db: PrismaClient;
}

export interface AuthAppContext extends AppContext {
  state: {
    user: {
      email: string;
      name: string;
      id: string;
      usersOnBoards: {
        permission: "owner" | "viewer" | "editor";
        boardId: string;
        userId: string;
      }[];
    };
  };
}

export interface AuthTokenContent {
  email: string;
}
