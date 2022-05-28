import { Button, Avatar, Menu, Divider } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { logout } from 'intents/account/actions';
import { useAccount } from 'intents/account/hooks';
import { DoorEnter, DoorExit, Friends, Settings, UserCheck } from 'tabler-icons-react';
import { capitalize } from './string';


export default function UserMenu() {
  const { authenticated, account } = useAccount();

  return (
    <Menu
      control={
        <Button variant='subtle'>
          <Avatar style={{ cursor: 'pointer' }} />
        </Button>
      }>
      {authenticated ? (
        <>
        <Menu.Label>{capitalize(account?.name)}</Menu.Label>
        <Menu.Item icon={<UserCheck />}>Friends</Menu.Item>
        <Menu.Item icon={<Settings />}>Preferences</Menu.Item>
        <Divider />
        <Menu.Item onClick={logout} icon={<DoorExit />}>Log Out</Menu.Item>
        </>
      ) : (
        <>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item icon={<DoorEnter />} component={NextLink} href='/account/login'>Login</Menu.Item>
        </>
      )}
    </Menu>
  );
}
