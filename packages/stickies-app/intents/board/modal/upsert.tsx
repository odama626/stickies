import {
  Modal,
  TextInput,
  Group,
  Button,
  Select,
  Divider,
  Text,
  Grid,
  Avatar,
  Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAccount } from 'intents/account/hooks';
import React, { FormEvent, useState } from 'react';

function UserInvite({ onChange }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  function onSubmit() {
    if (!/^(.+)@(.+)$/.test(email)) {
      return setError('A valid email is required');
    }
    {
      setError(null);
    }
    onChange({
      permission: 'viewer',
      user: { email },
    });
    setEmail('');
  }
  return (
    <Paper>
      <Text mt='md'>Invite People</Text>
      <Divider />
      <Group mt='md' align='flex-start'>
        <TextInput
          error={error}
          style={{ flexGrow: '1' }}
          type='email'
          placeholder='Add People'
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            e.stopPropagation();
            onSubmit();
          }}
        />
        <Button onClick={onSubmit} variant='outline'>
          Invite
        </Button>
      </Group>
    </Paper>
  );
}

export default function UpsertBoardModal({ opened, onClose, onSubmit, initialValues }) {
  const form = useForm({ initialValues: initialValues || {} });
  const { account } = useAccount();

  const isUpdate = !!initialValues?.id;
  const title = [isUpdate ? 'Edit' : 'Create', initialValues?.name, 'board']
    .filter(Boolean)
    .join(' ');
  const submitText = isUpdate ? 'Update' : 'Create';
  const submitForm = form.onSubmit(onSubmit);

  const accountPermission = form.values.usersOnBoards?.find(
    g => g.user.id === account.id
  )?.permission;
  const permissions = ['viewer', 'editor', 'owner'];
  const allowedSetPermissions = ['viewer', 'editor', 'owner'].splice(
    0,
    permissions.indexOf(accountPermission) + 1
  );

  // TODO: add people to boards

  return (
    <Modal size='lg' opened={opened} onClose={onClose} withCloseButton={false} title={title}>
      <form onSubmit={submitForm}>
        <TextInput data-autoFocus mt='sm' label='Name' required {...form.getInputProps('name')} />
        {isUpdate && (
          <>
            {/* <Divider my='lg' /> */}
            <UserInvite
              onChange={newUser => {
                form.setFieldValue('usersOnBoards', [...form.values.usersOnBoards, newUser]);
              }}
            />
            {form?.values?.usersOnBoards?.map((userOnBoard, index) => (
              <Paper key={userOnBoard.id}>
                <Grid my='md' mx='0' align='center' justify='space-between'>
                  <Group>
                    <Avatar>{userOnBoard.user.email.slice(0, 1).toUpperCase()}</Avatar>
                    <Text>{userOnBoard.user.email}</Text>
                  </Group>
                  <Select
                    disabled={
                      (userOnBoard.permission === 'owner' && userOnBoard.user.id === account.id) ||
                      !allowedSetPermissions.includes(userOnBoard.permission)
                    }
                    data={allowedSetPermissions}
                    value={userOnBoard.permission}
                    onChange={permission => {
                      console.log({ permission });
                      form.setFieldValue(
                        'usersOnBoards',
                        form.values.usersOnBoards.map((g, i) =>
                          i === index ? { ...g, permission } : g
                        )
                      );
                    }}
                  />
                </Grid>
              </Paper>
            ))}
          </>
        )}
        <Group position='right' mt='md'>
          <Button variant='subtle' onClick={onClose} type='reset'>
            Cancel
          </Button>
          <Button type='submit'>{submitText}</Button>
        </Group>
      </form>
    </Modal>
  );
}
