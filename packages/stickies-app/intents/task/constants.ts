import { Prisma } from "@prisma/client";

export type Task = Prisma.TaskGetPayload<{ include: {
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
}}>