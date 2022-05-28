import Router from "@koa/router";
import accounts from "./accounts";
import boards from "./boards";
import tasks from "./tasks";
import tags from './tags';

const router = new Router({ prefix: "/api/v1" });

router.use(`/accounts`, accounts.routes(), accounts.allowedMethods());
router.use("/boards", boards.routes(), boards.allowedMethods());
router.use("/tasks", tasks.routes(), tasks.allowedMethods());
router.use("/tags", tags.routes(), tags.allowedMethods());

export default router;
