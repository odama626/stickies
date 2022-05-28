import { socket, store } from "app/state";
import { useEffect } from "react";
import intentApi from "intents/intentApi";

function getCurrentUser(state) {
  return {
    boardIds: state?.usersById?.[state.userId]?.boardIds || [],
  };
}

export function useBoards() {
  const [userId] = store.use("userId");
  const [boards] = store.use(
    (state) =>
      getCurrentUser(state)
        ?.boardIds?.map((id) => state?.boardsById?.[id])
        .filter(Boolean) || []
  );
  useEffect(() => {
    if (!userId) return;
    intentApi.board.get().then((records) => {
      const items = records ?? [];
      const map = Object.fromEntries(items.map((task) => [task.id, task]));
      store.set(map, `boardsById`);
      store.set(
        items.map((d) => d.id),
        `usersById.${userId}.boardIds`
      );
    });
  }, [userId]);

  return boards;
}

export function useBoard(boardId) {
  // const [board, setBoard] = useState(null);
  const [board, setBoard] = store.use(`boardsById.${boardId}`);

  useEffect(() => {
    if (!boardId) return;
    intentApi.board.getById(boardId).then(setBoard);
    let curBoardId = boardId;
    socket.emit("subscribe", "board", curBoardId);

    function boardListener(action, board) {
      switch (action) {
        case "upsert":
          setBoard(board);
          return;
      }
    }

    socket.on("board", boardListener);

    return () => {
      socket.emit("unsubscribe", "board", curBoardId);
      socket.off("board", boardListener);
    };
  }, [boardId]);

  return board || {};
}
