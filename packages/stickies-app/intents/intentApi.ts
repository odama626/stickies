import * as board from './board/actions';
import * as tag from './tags/actions';
import * as task from './task/actions';
import * as account from './account/actions';

const intentApi = {
  board,
  tag,
  task,
  account
};

export default intentApi;
