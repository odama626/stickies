import { NotificationProps } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { X } from 'tabler-icons-react';

let notify: any = props => {
  const args = typeof props === 'string' ? { message: props } : props;
  console.log({ props });
  return showNotification(args);
};

notify.error = args => {
  console.error(args);
  return notify({ icon: <X size={18} />, color: 'red', ...args });
};

notify.netError = e => {
  console.error({ e });
  return notify.error({
    title: e.status,
    message: (
      <>
        <p>{e.response.statusText}</p>
        <p>{e.response.url}</p>
      </>
    ),
  });
};

notify.info = notify;

export default notify;
