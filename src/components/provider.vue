<template>
  <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN">
    <n-global-style />
    <NNotificationProvider>
      <n-loading-bar-provider>
        <n-message-provider>
          <n-dialog-provider>
            <slot />
          </n-dialog-provider>
        </n-message-provider>
      </n-loading-bar-provider>
    </NNotificationProvider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useOsTheme, darkTheme, NNotificationProvider, NConfigProvider, zhCN, dateZhCN, } from 'naive-ui'

const osTheme = useOsTheme()

// const theme = computed(() => (osTheme.value === 'dark' ? darkTheme : null))
const theme = computed(() => darkTheme);
</script>
