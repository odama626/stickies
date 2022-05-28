import { useRouter } from 'next/router';
import {
  Button,
  Group,
  SimpleGrid,
  Stack,
  Grid,
  Title,
  Menu,
  Divider,
  Paper,
} from '@mantine/core';
import { createPrompt } from 'app/confirmPromise';
import UpsertTaskModal from 'intents/task/modal/upsert';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Archive, AdjustmentsHorizontal, Tags } from 'tabler-icons-react';
import UpsertBoardModal from 'intents/board/modal/upsert';
import ManageTagsModal from 'intents/tags/modal/manage';
import { useBoard } from 'intents/board/hooks';
import { useTasksForBoard } from 'intents/task/hooks';
import Tag from 'intents/tags';
import { contrastColor } from 'contrast-color';
import Markdown from 'app/Markdown';
import { useTagsForBoard } from 'intents/tags/hooks';
import { getId } from 'intents/tags/actions';
import { socket, store } from 'app/state';
import wretch from 'wretch';
import { upsert } from 'intents/board/actions';
import UserMenu from 'app/UserMenu';
import { useEffect } from 'react';

export default function Board() {
  const router = useRouter();
  const { boardId } = router.query;
  const board = useBoard(boardId);
  const items = useTasksForBoard(boardId);
  useTagsForBoard(board.id);
  const [tagsById = {}] = store.use(`tagsById`);

  return (
    <Stack m='md'>
      <Grid justify='space-between'>
        <Group>
          <Title>{board.name}</Title>
        </Group>
        <Group>
          <Button
            variant='outline'
            onClick={() => createPrompt(UpsertTaskModal, { initialValues: { boardId } })}>
            Create Task
          </Button>
          <Menu>
            <Menu.Label>{board.name} board actions</Menu.Label>
            <Menu.Item
              icon={<AdjustmentsHorizontal />}
              onClick={() => createPrompt(UpsertBoardModal, { initialValues: board }).then(upsert)}>
              Edit Board
            </Menu.Item>
            <Menu.Item icon={<Tags />} onClick={() => createPrompt(ManageTagsModal, { board })}>
              Manage Tags
            </Menu.Item>
            <Divider />
            <Menu.Item icon={<Archive />}>Archive</Menu.Item>
          </Menu>
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
            {items.map(task => {
              return (
                <motion.div key={task.id} layout>
                  <Paper
                    sx={theme => {
                      const backgroundColor =
                        task.color ||
                        (theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white);
                      return {
                        backgroundColor,
                        color: contrastColor({ bgColor: backgroundColor }),
                        '&:hover': {
                          boxShadow: theme.shadows['lg'],
                        },
                      };
                    }}
                    p='md'
                    radius='sm'
                    color='red'
                    style={{ cursor: 'pointer' }}
                    shadow='sm'
                    onClick={() => {
                      createPrompt(UpsertTaskModal, { initialValues: task });
                    }}>
                    <Markdown content={task?.content} />
                    <Group spacing='xs'>
                      {task?.tagsOnTasks?.map(tagJoin => {
                        const tag = tagsById[tagJoin.tagId];
                        if (!tag) return null;
                        return <Tag key={tag.id} {...tag} />;
                      })}
                    </Group>
                  </Paper>
                </motion.div>
              );
            })}
          </LayoutGroup>
        </AnimatePresence>
      </SimpleGrid>
    </Stack>
  );
}
