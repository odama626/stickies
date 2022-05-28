import {
  Badge,
  Group,
  TextInput,
  ColorInput,
  ActionIcon,
  useMantineTheme,
  Button,
} from '@mantine/core';
import { contrastColor } from 'contrast-color';
import { useForm } from '@mantine/form';
import { Refresh } from 'tabler-icons-react';
import { initTag } from './actions';
import Tag from '.';

export default function UpsertTagSection({ colorTheme, onSubmit, initialValues }) {
  const theme = useMantineTheme();
  const colors = theme.colors[colorTheme];
  const randomColor = () => colors[(Math.random() * colors.length) | 0];

  const form = useForm({ initialValues: initTag(initialValues) });
  const isUpdate = !!initialValues.id

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Tag {...form.values} name={form.values.name || 'Label Preview'} />
      {/* <Badge
        style={{
          backgroundColor: form.values.color,
          color: contrastColor({ bgColor: form.values.color }),
        }}>
        {form.values.name || 'Label Preview'}
      </Badge> */}
      <Group my='md' direction='row'>
        <TextInput data-autofocus label='Name' required {...form.getInputProps('name')} />
        <ColorInput
          label='Color'
          {...form.getInputProps('color')}
          rightSection={
            <ActionIcon>
              <Refresh size={16} onClick={() => form.setFieldValue('color', randomColor())} />
            </ActionIcon>
          }
        />
      </Group>
      <TextInput label='Description' {...form.getInputProps('description')} />
      <Group position='right' mt='md'>
        <Button type='submit'>{isUpdate ? 'Update' : 'Create'}</Button>
      </Group>
    </form>
  );
}
