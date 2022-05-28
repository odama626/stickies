import { EditorView } from "@codemirror/view";
import { contrastColor } from 'contrast-color';

function rgba2hex(color){
  if (color.startsWith('#')) return color;
  const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
  const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`;
  
  return hex;
}

export function createEditorTheme(theme, opts = {}) {
    const isDark = theme.colorScheme === 'dark';
    const baseColor = opts.baseColor ?? (isDark ? theme.colors.dark[5] : theme.white);
    let backgroundColor = isDark ? theme.colors.dark[5] : theme.white;
    let gutterColor = theme?.fn?.darken(baseColor, 0.4);

    if (opts.baseColor) {
      backgroundColor = theme?.fn?.darken(opts.baseColor, 0.5)
      gutterColor = theme?.fn?.darken(opts.baseColor, 0.6);
    }

    const color = contrastColor({ bgColor: rgba2hex(backgroundColor)});

    return EditorView.theme(
      {
        '&': {
          color,
          'margin-top': theme.spacing.md + 'px',
          'border-radius': theme.radius.sm + 'px',
          overflow: 'hidden',
          // minHeight: '7rem',
          backgroundColor,
        },
        '.cm-content': {
          caretColor: theme.primaryColor[5],
          minHeight: '7rem'
        },
        '&.cm-focused .cm-cursor': {
          borderLeftColor: isDark ? theme.white : theme.colors.black,
          // background: 'red',
        },
        '&.cm-focused .cm-selectionBackground, ::selection': {
          backgroundColor: gutterColor,
        },
        '.cm-gutters': {
          backgroundColor: gutterColor,
          color: theme?.fn?.lighten(baseColor, 0.3), //theme?.fn?.darken(opts.baseColor, 0.1),
          // border: 'none',
        },
      },
      { dark: true }
    );
}