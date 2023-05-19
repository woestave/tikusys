import { NButton, NotificationReactive, useNotification } from 'naive-ui';
import { VNodeChild } from 'vue';
import { useRouter } from 'vue-router';




export function useNotificationWithDuration (options: {
  getTitle: (leftTime: number) => string;
  getActionText: (leftTime: number) => VNodeChild;
  onAfterLeave?: (n: NotificationReactive) => void;
  onTimeout?: (n: NotificationReactive) => void;
  closeWhenTimeout?: boolean;
  closable?: boolean;
}) {
  const notification = useNotification();

  const router = useRouter();

  function onGoTikuList () {
    router.push({ name: 'tiku-list', });
  }

  return function (duration: number) {
    let count = (duration || 5000) / 1000;
    const n = notification.create({
      title: options.getTitle(count),
      // duration: count * 1000,
      closable: options.closable,
      meta: new Date().toLocaleString(),
      action: () => (
        <NButton text type="primary" onClick={() => {
          n.destroy();
          onGoTikuList();
        }}>{options.getActionText(count)}</NButton>
      ),
      onAfterEnter: () => {
        const minusCount = () => {
          count--;
          n.title = options.getTitle(count);
          if (count > 0) {
            window.setTimeout(minusCount, 1000);
          } else {
            options.onTimeout?.(n);
            options.closeWhenTimeout === false ? null : n.destroy();
          }
        }
        window.setTimeout(minusCount, 1000)
      },
      onAfterLeave () {
        options.onAfterLeave?.(n);
      },
    });

    return n;
  };
}



export function useNotificationPreset1 (title: string, actionText: string) {
  return useNotificationWithDuration({
    closable: true,
    getTitle (leftTime) {
      return `${title}(${leftTime})`;
    },
    getActionText (leftTime) {
      return actionText;
    },
    onAfterLeave (n) {},
    onTimeout (n) {},
  });
}


