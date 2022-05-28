import { Tag } from "@prisma/client";
import { socket, store } from "app/state";
import intentApi from "intents/intentApi";
import { useEffect } from "react";

export function useTagsForBoard(boardId) {
  const [items] = store.use(
    (state) => state?.boardsById?.[boardId]?.tagIds?.map((tagId) => state?.tagsById?.[tagId]) || []
  );

  useEffect(() => {
    if (!boardId) return;
    intentApi.tag.find({ where: { boardId }, orderBy: { name: "asc" } }).then((results) => {
      const items = results ?? [];
      let map = Object.fromEntries(items.map((tag) => [tag.id, tag]));
      store.set(map, "tagsById");
      store.set(
        items.map((item) => item.id),
        `boardsById.${boardId}.tagIds`
      );
    });

    async function tagListener(action, tags: Tag[]) {
      switch (action) {
        case "upsert":
          await Promise.all(tags.map((tag) => store.set(tag, `tagsById.${tag.id}`)));
          const items: Tag[] = store.get((state) =>
            state.boardsById[boardId].tagIds.map((id) => state.tagsById[id])
          );
          store.set(
            items.sort((a, b) => a.name.localeCompare(b.name)).map((tag) => tag.id),
            `boardsById.${boardId}.tagIds`
          );
          return;
        case "delete":
          tags.forEach((tag) => store.set(undefined, `tagsById.${tag.id}`, { overwrite: true }));
          store.set(
            (ids) => ids.filter((id) => !tags.find((t) => t.id === id)),
            `boardsById.${boardId}.tagIds`
          );
      }
    }

    socket.on("tag", tagListener);

    return () => {
      socket.off("tag", tagListener);
    };
  }, [boardId]);

  return items;
}
