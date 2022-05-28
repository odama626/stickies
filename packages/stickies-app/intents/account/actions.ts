import { store } from "app/state";
import { externalApi } from "app/api";

const endpoint = `/accounts`;

export function getAuthorizedAccount() {
  return externalApi
    .url(endpoint)
    .get()
    .json()
    .then((account) => {
      store.set(account, `usersById.${account.id}`);
      store.set(account.id, `userId`);
      return account;
    });
}

export function logout() {
  const id = store.get(`userId`);
  return externalApi
    .url(endpoint + `/logout`)
    .post()
    .text()
    .then(() => document.location.reload());
}
