import { produce as immerProduce } from 'immer';
import { createStore } from 'dawei';
import SocketIO from 'socket.io-client'


export const produce =
  <T>(func: (T) => void) =>
  (currentState: T) =>
    immerProduce(currentState, func);



interface ConvertNullOpts {
  defaults?: any;
  sanitize?: boolean;
}

export function convertNullToUndefined(ob, { sanitize = false, defaults }: ConvertNullOpts = {}) {
  return Object.fromEntries(
    Object.entries(ob).map(([key, value]) => {
      let v = value === null ? (defaults?.[key] ?? undefined) : value;
      if (sanitize && typeof v === 'object') v = defaults?.[key] ?? undefined;
      return [key, v];
    })
  );
}

export const store = createStore();
export const socket = SocketIO(process.env.NEXT_PUBLIC_API_URL);


