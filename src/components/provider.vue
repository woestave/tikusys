<template>
  <n-config-provider :theme="theme">
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
import { useOsTheme, darkTheme, NNotificationProvider } from 'naive-ui'

const osTheme = useOsTheme()

const theme = computed(() => (osTheme.value === 'dark' ? darkTheme : null))
</script>
