import { NSpin } from 'naive-ui';
import { functionalComponent } from './functional-component';
import { computed, ref } from 'vue';

interface ShowItem {
  show: boolean;
  name: string;
}

export function createLoading () {
  let __key = 0;

  const __maps = ref<{ [key: string]: ShowItem; }>({});

  function getItem (key: string) {
    return __maps.value[key];
  }
  function setItem (key: number, value: ShowItem) {
    return __maps.value[key] = value;
  }

  function getValues () {
    return Object.keys(__maps.value).map(getItem);
  }

  const LoadingView = functionalComponent((props) => {
    const show = computed(() => {
      const keys = Object.keys(__maps.value);
      return keys.length > 0 && keys.some(x => getItem(x).show);
    });

    return () => (
      <NSpin show={show.value} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}>
        {{
          default: props.context.slots.default,
          description: () => <span>{getValues().find(x => x.show)?.name}</span>,
        }}
      </NSpin>
    );
  });

  function useCreateLoadingKey (options = {
    name: '' as string | (() => string),
  }) {

    // const currentInstance = getCurrentInstance();
    const myKey = __key++;

    function show () {
      setItem(myKey, {
        show: true,
        name: typeof options.name === 'function' ? options.name() : options.name,
      });
    }
    function hide () {
      setItem(myKey, {
        show: false,
        name: typeof options.name === 'function' ? options.name() : options.name,
      });
    }

    hide();

    return {
      show, hide,
    };
  }

  return {
    LoadingView,
    useCreateLoadingKey,
  };
}

export const globalLoading = createLoading();
