import { functionalComponent } from '@/utils/functional-component';
import { NNumberAnimation } from 'naive-ui';
import { ref, watch } from 'vue';

export const NumberAnimation = functionalComponent<{
  value: number;
  duration?: number;
}>((props) => {

  const v = ref({
    from: props.value,
    to: props.value,
  });
  watch(() => props.value, (n, o) => {
    v.value.from = o;
    v.value.to = n;
  });

  return () => (
    <NNumberAnimation from={v.value.from} to={v.value.to} duration={props.duration || 500} />
  );
});
