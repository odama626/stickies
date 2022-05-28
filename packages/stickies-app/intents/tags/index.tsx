import { Badge } from '@mantine/core';
import { iTag } from './actions';
import { contrastColor } from 'contrast-color';

export default function Tag(tag: iTag) {
  return (
    <Badge
      style={{
        backgroundColor: tag.color,
        color: contrastColor({ bgColor: tag.color }),
      }}>
      {tag.name}
    </Badge>
  );
}
