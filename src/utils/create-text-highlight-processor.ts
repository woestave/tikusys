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

  const empty = document.createElement('div');

  function highlightProcessor (text: string, search?: string) {
    const hl = search?.trim();
    const tag = options.tag || 'span';

    const uuid = key + '_' + Math.random() * 100000;

    empty.innerText = hl ? text.replace(hl, uuid) : text;

    const res = empty.innerHTML;
    empty.innerText = hl || '';
    const hlEscaped = empty.innerHTML;
    return hl ? res.replace(uuid, `<${tag} class="global--text-highlight ${key} ${options.className || ''}">${hlEscaped}</${tag}>`) : res;
  }

  highlightProcessor.options = options;

  return highlightProcessor;
}

export const globalTextHighlightProcessor = createTextHighlightProcessor({
  color: 'white',
  bgColor: '#009688',
});
