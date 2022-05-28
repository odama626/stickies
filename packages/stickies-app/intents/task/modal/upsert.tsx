import {
  Modal,
  Group,
  Button,
  Grid,
  Menu,
  Text,
  ColorInput,
  Paper,
  useMantineTheme,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { initTask, upsert } from '../actions';
import notify from 'app/notify';
import RichText from 'app/RichText';
import { contrastColor } from 'contrast-color';

export default function UpsertTaskModal({ opened, onClose, onSubmit, initialValues }) {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: initTask(initialValues, {
      sanitize: true,
      defaults: { color: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white },
    }),
  });

  const isUpdate = !!initialValues?.id;
  const title = [isUpdate ? 'Edit' : 'Create', initialValues?.title, 'task']
    .filter(Boolean)
    .join(' ');
  const submitText = isUpdate ? 'Update' : 'Create';

  const submitForm = form.onSubmit(async values => {
    try {
      const result = await upsert(values);

      onSubmit(values);
    } catch (e) {
      console.log('failed to update', e);
      notify.error({
        title: `Failed to ${isUpdate ? 'update' : 'create'} task`,
        message: e.message,
      });
    }
  });

  return (
    <Modal size='lg' opened={opened} onClose={onClose} withCloseButton={false}>
      <Paper
        sx={theme => {
          const backgroundColor = form.values.color;
          return {
            padding: '20px',
            margin: '-20px',
            backgroundColor,
            color: contrastColor({ bgColor: backgroundColor }),
            '&:hover': {
              boxShadow: theme.shadows['lg'],
            },
          };
        }}>
        <Grid px='sm' justify='space-between'>
          <Text>{title}</Text>
          <Menu>
            <Menu.Label>Extended Properties</Menu.Label>
            <Menu.Item>Change</Menu.Item>
            <ColorInput label='Change Color' {...form.getInputProps('color')} />
          </Menu>
        </Grid>
        <form onSubmit={submitForm}>
          <RichText
            baseColor={form.values.color}
            mt='md'
            data-autofocus
            onSubmit={submitForm}
            placeholder='Content'
            {...form.getInputProps('content')}
          />
          <ColorInput mt='sm' label='Color' {...form.getInputProps('color')} />
          {isUpdate && (
            <TextInput mt='sm' label='Created By' disabled value={initialValues.createdBy.name} />
          )}

          {/* <MultiSelect
          mt='md'
          label='Tags'
          data={initialValues.tags}
          itemComponent={item => (
            <div>
              <Tag {...item} />
            </div>
          )}
        /> */}
          <Group position='right' mt='md'>
            <Button variant='subtle' onClick={onClose} type='reset'>
              Cancel
            </Button>
            <Button type='submit'>{submitText}</Button>
          </Group>
        </form>
      </Paper>
    </Modal>
  );
}
