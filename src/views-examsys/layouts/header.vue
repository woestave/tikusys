<template>
  <n-layout-header bordered>
    <n-button text @click="router.back()">
      <icon type="ArrowBack" size="20" :depth="2" />
    </n-button>
    <n-button text @click="router.go(0)">
      <icon type="refresh" size="20" :depth="2" />
    </n-button>
    <!-- <n-breadcrumb>
      <n-breadcrumb-item href="/">Dashboard</n-breadcrumb-item>
      <n-breadcrumb-item :href="router.currentRoute.value.path">{{router.currentRoute.value.meta?.title}}</n-breadcrumb-item>
    </n-breadcrumb> -->
    <n-text>{{router.currentRoute.value.meta?.title}}</n-text>
    <n-space :size="20" align="center" style="line-height: 1">
      <n-popover trigger="click" placement="bottom-end" :width="300">
        <template #trigger>
          <n-badge dot processing>
            <icon type="notifications" size="22" :depth="2" />
          </n-badge>
        </template>
        <n-tabs type="line" justify-content="space-evenly" style="--pane-padding: 0">
          <n-tab-pane name="notifications" tab="Notifications (5)">
            <n-list style="margin: 0">
              <n-list-item v-for="i in 5" :key="i"> Notification {{ i }} </n-list-item>
            </n-list>
          </n-tab-pane>
          <n-tab-pane name="messages" tab="Messages (6)">
            <n-list style="margin: 0">
              <n-list-item v-for="i in 6" :key="i"> Message {{ i }} </n-list-item>
            </n-list>
          </n-tab-pane>
        </n-tabs>
      </n-popover>
      <n-dropdown placement="bottom-end" show-arrow :options="options" @select="handleOptionsSelect">
        <n-avatar size="small" round :src="me?.avatar" />
      </n-dropdown>
    </n-space>
  </n-layout-header>
</template>

<script lang="ts" setup>
import { computed, ref, } from 'vue';
// import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
// import { useCurrentUser } from '@/composables'
import { Icon } from '@/components';
import { tokens } from '@/apis/request';
import defaultAvatar from '@/assets/images/default-avatar.png';

import { onMounted } from 'vue';
import examsysServices from '@/apis/services/examsys';

const router = useRouter();

// const message = useMessage()
// const { data: me } = useCurrentUser()
const me = ref({
  avatar: defaultAvatar,
  name: '',
});

const options = computed(() => [
  { key: 'me', label: me.value.name, },
  { key: 'logout', label: '退出登录', },
]);

onMounted(() => {
  examsysServices.getUserInfo().then((res) => {
    console.log('userInfo', res.data.userInfo);
    me.value.name = res.data.userInfo.studentName;
  }).catch((err) => {
    if (err?.errNo === 401) {
      router.replace({ name: 'login', query: { redirect: router.currentRoute.value.fullPath, }, });
    }
  });
});

const handleOptionsSelect = async (key: unknown): Promise<void> => {
  // if (key as string === 'logout') {
  //   await token.revoke()
  //   await router.push({ name: 'login' })
  // } else if (key as string === 'me') {
  //   message.success(`Welcome back, ${me.value?.name as string}!`)
  // }
  if (key === 'logout') {
    tokens.removeToken();
    location.reload();
  }
}
</script>

<style scoped>
.n-layout-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 9px 18px;
}

.n-button {
  margin-right: 15px;
}

.n-space {
  margin-left: auto;
}
</style>
