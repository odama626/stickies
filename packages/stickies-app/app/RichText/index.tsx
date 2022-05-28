import { Compartment, StateEffect, StateField } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { useMantineTheme } from '@mantine/core';
import { markdown } from '@codemirror/lang-markdown';

export { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

// RichText.tsx in your components folder
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { getDefaultExtensions } from './extensions';
import { createEditorTheme } from './theme';

export default function RichText({ baseColor, onChange, value, onSubmit, ...rest }) {
  const ref = useRef();
  const theme = useMantineTheme();
  const editor = useRef();

  const propRef = useRef({});

  useLayoutEffect(() => {
    propRef.current = { onChange, value, onSubmit };
  }, [onChange, value, onSubmit]);

  useLayoutEffect(() => {
    if (!editor.current) return;
    editor.current.changeTheme({ baseColor })
  }, [baseColor])

  // useLayoutEffect(() => {
  //   if (!editor.current) return;
  //   editor.current.state.update([{ newDoc: value }]);
  // }, [value]);

  useLayoutEffect(() => {
    const language = new Compartment();
    // const dynamicTheme = StateField.define({
    //   create() { return createEditorTheme(theme, { baseColor }) },
    //   update()
    // })
    const extensions = [
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            propRef.current.onSubmit?.(new Event('submit'));
            return true;
          },
        },
      ]),
      ...getDefaultExtensions(),
      language.of(markdown()),
      EditorView.updateListener.of(v => {
        // console.log(v);
        if (v.docChanged) {
          propRef.current.onChange?.(v.state.doc.toString());
        }
      }),
    ];

    let state = EditorState.create({
      doc: propRef.current.value,
      extensions: [...extensions, createEditorTheme(theme, { baseColor })],
    });

    let view = new EditorView({
      state: state,
      parent: ref.current,
    });

    // view.dispatch({
    //   effects: StateEffect.reconfigure.of(getDefaultExtensions({ theme: createEditorTheme(theme, { baseColor: '#00ff00' }) }))
    // })

    view.dom.focus();

    editor.current = {
      view,
      state,
      changeTheme: updates => {
        view.dispatch({
          effects: StateEffect.reconfigure.of([...extensions, createEditorTheme(theme, updates)]),
        });
      },
    };

    return () => {
      view.destroy();
    };
  }, []);

  return <div {...rest} style={{ width: '100%' }} ref={ref} />;
}
