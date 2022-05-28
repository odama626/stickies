import { externalApi } from "app/api";
import { store } from "app/state";

const endpoint = `/boards`;

export function upsert(record) {
  return externalApi
    .url(endpoint + `/${record.id}`)
    .post({ record })
    .json()
    .then((record) => {
      store.set(record, `boardsById.${record.id}`);
      store.set(
        (ids = []) => [record.id, ...ids.filter((id) => id !== record.id)],
        `usersById.${store.get("userId")}.boardIds`
      );
      return record;
    });
}

interface GetProps {
  query?: {
    [key: string]: string;
  };
}

export function get({ query = {} }: GetProps = {}) {
  return externalApi.url(endpoint).query(query).get().json();
}

export function getById(id) {
  return externalApi.url(endpoint + `/${id}`).get().json();
}

// export function del(id: string) {
//   return wretch(`${endpoint}?id=${id}`)
//     .delete()
//     .json()
//     .then(record => {
//       store.set(ids => ids.filter(id => id !== record.id), `usersById.${getCurrentUserId()}.boardIds`);
//       store.set(undefined, `boardsById.${record.id}`)
//     });
// }
