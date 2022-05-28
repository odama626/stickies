import { Avatar, Button, Card, Grid, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { createPrompt } from 'app/confirmPromise';
import { produce, store } from 'app/state';
import supabase from 'app/supabase';
import UserMenu from 'app/UserMenu';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { upsert } from 'intents/board/actions';
import { useBoards } from 'intents/board/hooks';
import UpsertBoardModal from 'intents/board/modal/upsert';
import Head from 'next/head';
import Link from 'next/link';
import wretch from 'wretch';

export default function Home() {
  const boards = useBoards();

  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        <title>Stickies</title>
      </Head>

      <Stack m='md'>
        <Grid justify='space-between'>
          <Group>
            <Title>Get Sticky</Title>
            <Button variant='outline' onClick={() => createPrompt(UpsertBoardModal).then(upsert)}>
              Create New Board
            </Button>
          </Group>
          <Group>
            <UserMenu />
          </Group>
        </Grid>
        <SimpleGrid
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
            { maxWidth: 'md', cols: 4 },
            { minWidth: 'xl', cols: 6 },
          ]}
          cols={4}
          mt='lg'>
          <AnimatePresence>
            <LayoutGroup>
              {boards.map(board => {
                return (
                  <motion.div key={board?.id} layout>
                    <Link href={`/board/${board?.id}`}>
                      {/* <HoverOverlay
                        overlay={
                          <Menu>
                            <Menu.Label>Application</Menu.Label>
                          </Menu>
                        }> */}
                      <Card shadow='sm' style={{ cursor: 'pointer' }}>
                        <Group position='apart'>
                          <Text>{board.name}</Text>
                        </Group>
                      </Card>
                      {/* </HoverOverlay> */}
                    </Link>
                  </motion.div>
                );
              })}
            </LayoutGroup>
          </AnimatePresence>
        </SimpleGrid>
      </Stack>
    </>
  );
}
