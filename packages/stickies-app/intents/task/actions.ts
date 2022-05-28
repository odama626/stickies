import { externalApi } from "app/api";
import { convertNullToUndefined, store } from "app/state";
import wretch from "wretch";
import { Task } from "./constants";

// export interface Task {
//   id: number;
//   created_at: string;
//   modified_at: string;
//   color: string;

//   title: string;
//   content: string;

//   boardId: string;
// }

export function initTask(task: Partial<Task> = {}, ops?): Partial<Task> {
  return {
    title: "",
    content: "",
    ...convertNullToUndefined(task, ops),
  };
}

const endpoint = `/tasks`;

export function upsert(record) {
  return externalApi
    .url(endpoint + `/${record.id}`)
    .post({ record })
    .json()
    .then(async (record: Task) => {
      store.set(record, `tasksById.${record.id}`);
      store.set(
        (ids = []) => [record.id, ...ids.filter((id) => id !== record.id)],
        `boardsById.${record.boardId}.taskIds`
        );
        
      const tags = record.tagsOnTasks?.map((t) => t.tag) || [];
      const tagMap = Object.fromEntries(tags.map((t) => [t.id, t]));
      await store.set(tagMap, `tagsById`);

      const allTags = store.get("tagsById");
      store.set((ids = []) => {
        const newIds = Array.from(new Set([...ids, ...tags.map((t) => t.id)]));
        return newIds.sort((a, b) => allTags[a].name.localeCompare(allTags[b].name));
      }, `boardsById.${record.boardId}.tagIds`);
    });
}

interface GetProps {
  query?: {
    [key: string]: string;
  };
}

export function getByBoardId(boardId: string) {
  return externalApi
    .url(endpoint + `/board/${boardId}`)
    .get()
    .json();
}

export function get({ query }: GetProps = {}) {
  return externalApi.url(endpoint).query(query).get().json();
}

export function getById(id: string) {
  return externalApi
    .url(endpoint + `/${id}`)
    .get()
    .json();
}
