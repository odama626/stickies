import {
  Button,
  Collapse,
  Grid,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Table,
  useMantineTheme,
} from '@mantine/core';
import supabase from 'app/supabase';
import { produce } from 'app/state';
import { Fragment, useState } from 'react';
import { useTagsForBoard } from '../hooks';
import UpsertTagSection from '../upsert';
import Tag from '..';
import { del, getId, upsert } from '../actions';

export default function ManageTagsModal({ opened, onClose, onSubmit, board, colorTheme = 'tags' }) {
  const tags = useTagsForBoard(board.id);
  const [state, setState] = useState({});
  const theme = useMantineTheme();
  const colors = theme.colors[colorTheme];

  return (
    <Modal
      size='xl'
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      title={`Manage ${board.name} tags`}>
      <Grid justify='space-between'>
        <Group></Group>
        <Group>
          <Button
            variant='outline'
            onClick={() =>
              setState(
                produce(draft => {
                  draft.type = draft.type === 'create' ? '' : 'create';
                })
              )
            }>
            New Tag
          </Button>
        </Group>
      </Grid>
      <Collapse in={state?.type === 'create'}>
        <Paper
          radius='md'
          p='lg'
          mt='md'
          sx={theme => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
          })}>
          <UpsertTagSection
            initialValues={{ board_id: board.id }}
            onSubmit={async tag => {
              await upsert(tag);
              setState({});
            }}
            colorTheme={colorTheme}
          />
        </Paper>
      </Collapse>
      <ScrollArea mt='md'>
        <Table>
          <tbody>
            {tags.map(tag => {
              // const tag = tagMap[id];
              const isEditing = state.type === 'edit' && state.id === getId(tag);
              return (
                <Fragment key={getId(tag)}>
                  {isEditing ? (
                    <tr>
                      <td colSpan={3}>
                        <UpsertTagSection
                          initialValues={tag}
                          onSubmit={async record => {
                            await upsert(record);
                            setState({});
                          }}
                          colorTheme={colorTheme}
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td>
                        <Tag {...tag} />
                      </td>
                      <td>{tag.description}</td>
                      <td>
                        <Group position='right'>
                          <Button
                            variant='subtle'
                            onClick={() => setState({ type: 'edit', id: getId(tag) })}>
                            Edit
                          </Button>
                          <Button variant='subtle' onClick={() => del(tag.id)}>
                            Delete
                          </Button>
                        </Group>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </ScrollArea>
      <Group position='right' mt='md'>
        <Button onClick={onClose}>Done</Button>
      </Group>
    </Modal>
  );
}
