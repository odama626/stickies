import { useReducer } from 'react';
import { Modal, ModalProps } from '@mantine/core';

const modals = [];
let forceUpdate;

type PromptProps = ModalProps & { onClose(): void; onSubmit(): void };
type Prompt = PromptProps | ((PromptProps) => any);

export function createPrompt(modalProps: Prompt, props: any = {}) {
  const cleanup = () => {
    modals.shift();
    forceUpdate?.();
  };

  let extendedProps = { ...props, opened: true, onSubmit: () => {}, onClose: () => {} };

  if (typeof modalProps !== 'function') {
    extendedProps = modalProps;
  }

  const promise = new Promise<void>((resolve, reject) => {
    extendedProps.onSubmit = (...args) => {
      resolve(...args);
      cleanup();
    };
    extendedProps.onClose = () => {
      reject();
      cleanup();
    };
  });

  modals.unshift([typeof modalProps === 'function' ? modalProps : Modal, extendedProps]);
  forceUpdate?.();
  return promise;
}

export default function ConfirmModalContext() {
  forceUpdate = useReducer(c => c + 1, 0)[1];
  const [Modal, props] = modals[0] || [];

  if (!Modal) return null;
  return <Modal {...props} />;
}
