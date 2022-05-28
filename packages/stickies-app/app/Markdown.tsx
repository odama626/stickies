import { useEffect, useState } from 'react';
import processRemark from './getRemark';

export default function Markdown({ content }) {
  const [__html, setHtml] = useState(null);

  useEffect(() => {
    processRemark(content).then(setHtml);
  }, [content]);

  return __html //<div dangerouslySetInnerHTML={{ __html }} />;
}
