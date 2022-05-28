import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeReact from 'rehype-react';
import { createElement, Fragment } from 'react';
import { Checkbox, List, Text } from '@mantine/core';

export default async function processRemark(md) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        p: Text,
        // input: props => {
        //   return <Checkbox checked={props.checked} disabled={props.disabled} />;
        // },
        // ul: List,
        // li: props => {
        //   const children: any[] = props.children.slice();
        //   let checkbox;
        //   if (children?.[0]?.props?.type === 'checkbox') checkbox = children.shift();
        //   return checkbox ? (
        //     <Checkbox {...checkbox.props} label={children} />
        //   ) : (
        //     <List.Item>{children}</List.Item>
        //   );
        // },
      },
    })
    // .use(rehypeStringify)
    .process(md);

  return file.result;
}
