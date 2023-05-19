let __uid = 0;

export function createTextHighlightProcessor (options: {
  color: string;
  bold?: boolean;
  bgColor?: string;
  tag?: string;
  className?: string;
}) {

  __uid++;

  const key = `highlight-0${__uid}`;

  const sty = document.createElement('style');
  sty.innerHTML = `
    .${key} {
      color: ${options.color};
      font-weight: ${options.bold ? 600 : 'inherit'};
      background: ${options.bgColor || 'none'};
    }
  `;
  document.head.appendChild(sty);

  function highlightProcessor (text: string, search?: string) {
    const hl = search?.trim();
    const tag = options.tag || 'span';

    return hl ? text.replace(hl, `<${tag} class="global--text-highlight ${key} ${options.className || ''}">${hl}</${tag}>`) : text;
  }

  highlightProcessor.options = options;

  return highlightProcessor;
}

export const globalTextHighlightProcessor = createTextHighlightProcessor({
  color: 'white',
  bgColor: '#009688',
});
