import { convertNullToUndefined, store } from "app/state";
import { COLOR_SCHEMES } from "./constants";
import wretch from "wretch";
import internalApi, { externalApi } from "app/api";
import { Prisma } from "@prisma/client";
import JsonURL from '@jsonurl/jsonurl'

export interface iTag {
  id: number;
  created_at: string;

  name: string;
  description: string;
  color: string;

  board_id: string;
}

const endpoint = "/tags";

export function initTag(tag: Partial<iTag> = {}): Partial<iTag> {
  const colors = COLOR_SCHEMES.tags;
  return {
    name: "",
    description: "",
    color: colors[(Math.random() * colors.length) | 0],

    ...convertNullToUndefined(tag),
  };
}

export function getId(tag: Partial<iTag>) {
  return tag.board_id + tag.name;
}

interface GetProps {
  query?: {
    [key: string]: string;
  };
}

export async function get({ query }: GetProps = {}) {
  return externalApi.url(endpoint).query(query).get().json();
}

function crush(query) {
  return JsonURL.stringify(query)
}

export async function find(query: Prisma.TagFindManyArgs) {
  return externalApi
    .url(endpoint + `/find/${crush(query)}`)
    .get()
    .json();
}

export async function getByBoardId(boardId: string) {
  return externalApi
    .url(endpoint + `/board/${boardId}`)
    .get()
    .json();
}

export async function upsert(record) {
  return externalApi
    .url(endpoint)
    .post({ record })
    .json()
    .then((result) => {
      store.set(result, `tagsById.${result.id}`);
      const allTags = store.get("tagsById");
      store.set((ids = []) => {
        const newIds = Array.from(new Set([...ids, result.id]));
        return newIds.sort((a, b) => allTags[a].name.localeCompare(allTags[b].name));
      }, `boardsById.${result.boardId}.tagIds`);
    });
}

export async function del(id: string) {
  return externalApi
    .url(endpoint + `/${id}`)
    .delete()
    .json()
    .then((result) => {
      store.set(
        (ids) => ids.filter((id) => id !== result.id),
        `boardsById.${result.boardId}.tagIds`
      );
      store.set(undefined, `tagsById.${result.id}`);
    });
}
