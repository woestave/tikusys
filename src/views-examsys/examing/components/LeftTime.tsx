import { formatMsToHMS } from '@/utils/HMS';
import { functionalComponent } from '@/utils/functional-component';
import { NH1 } from 'naive-ui';
import { onMounted, onUnmounted, ref } from 'vue';

export default functionalComponent<{
  examDate: number;
  examDuration: number;
  onStart: (onStart: () => void) => void;
}>((props) => {

  const leftTimeHMS = ref({
    h: 0,
    m: 0,
    s: 0,
    left: 0,
  });

  const timer = ref<null | number>(null);

  onMounted(() => {
    let prev = 0;
    function next () {
      timer.value = requestAnimationFrame(() => {
        const examDate = props.examDate;
        const examDuration = props.examDuration;
        if (!examDate || !examDuration) {
          return;
        }
        const now = Date.now();
        // 做一个节流 省点内存
        if (now - prev < 150) {
          return next();
        }
        const leftTime = (examDate + (examDuration * 60 * 1000)) - now;
        const hms = formatMsToHMS(leftTime);
        leftTimeHMS.value.h = hms.h;
        leftTimeHMS.value.m = hms.m;
        leftTimeHMS.value.s = hms.s;
        leftTimeHMS.value.left = leftTime;
        prev = now;

        next();
      });
    }
    props.onStart?.(next);
  });
  onUnmounted(() => {
    typeof timer.value === 'number' && cancelAnimationFrame(timer.value);
  });

  return () => (
    <>
      {leftTimeHMS.value.left < 0 ? (
        <NH1>已结束</NH1>
      ) : (
        <NH1>{leftTimeHMS.value.h}时{leftTimeHMS.value.m}分{leftTimeHMS.value.s}秒</NH1>
      )}
    </>
  );
});
