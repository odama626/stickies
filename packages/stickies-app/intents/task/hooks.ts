import { useEffect } from "react";
import { socket, store } from "app/state";
import intentApi from "intents/intentApi";
import { Prisma, Tag} from "@prisma/client";
import { Task } from "./constants";



export function useTasksForBoard(boardId) {
  const [items] = store.use(
    (state) => state?.boardsById?.[boardId]?.taskIds?.map((taskId) => state.tasksById[taskId]) || []
  );

  useEffect(() => {
    if (!boardId) return;

    intentApi.task.getByBoardId(boardId).then((records: Tag[]) => {
      const items = records ?? [];
      const map = {};
      const ids = [];
      items.forEach((item) => {
        map[item.id] = item;
        ids.push(item.id);
      });
      store.set(map, `tasksById`);
      store.set(ids, `boardsById.${boardId}.taskIds`);
    });

    async function taskListener(action, task: Task) {
      switch (action) {
        case "upsert":
          console.log(task)
          if (task.tagsOnTasks) {
            task.tagsOnTasks = task?.tagsOnTasks?.sort((a, b) => a.tag.name.localeCompare(b.tag.name));

            await Promise.all(task.tagsOnTasks?.map((tagOnTask) => store.set(tagOnTask.tag, `tagsById.${tagOnTask.tag.id}`)));
            const items: Tag[] = store.get((state) =>
              state.boardsById[boardId].tagIds.map((id) => state.tagsById[id])
            );
            store.set(
              items.sort((a, b) => a.name.localeCompare(b.name)).map((tag) => tag.id),
              `boardsById.${boardId}.tagIds`
            );
          }
          store.set(task, `tasksById.${task.id}`);
          store.set(
            (ids) => [task.id, ...ids.filter((id) => id !== task.id)],
            `boardsById.${boardId}.taskIds`
          );
          return;
      }
    }

    socket.on("task", taskListener);

    return () => {
      socket.off("task", taskListener);
    };
  }, [boardId]);

  return items;
}
