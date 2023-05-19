<template>
  <LoadingView>
    <router-view />
  </LoadingView>
</template>

<script lang="ts" setup>
import { useLoadingBar } from 'naive-ui'
import { globalLoading } from '@/utils/create-loading';
import { useRouter } from 'vue-router';

const router = useRouter();

const LoadingView = globalLoading.LoadingView;

// todo: route transtion

const loadingBar = useLoadingBar()

router.beforeEach(() => loadingBar?.start())

router.afterEach(() => loadingBar?.finish())
</script>

<!-- <template>
  <suspense @pending="loadingBar?.start" @resolve="loadingBar.finish">
    <template #default>
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <keep-alive>
            <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
          </keep-alive>
        </transition>
      </router-view>
    </template>
    <template #fallback> Loading... </template>
  </suspense>
</template>

<script lang="ts" setup>
import { useLoadingBar } from 'naive-ui'
const loadingBar = useLoadingBar()
</script> -->
