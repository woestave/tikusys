<!-- Home -->

<template>
  <n-result
    status="success"
    title="学生考试系统"
    description=""
    size="huge"
  >
    <template #footer>
      <!-- <n-p v-if="currentUser1">Hey1, {{ currentUser1.name }}</n-p>
      <n-p v-if="currentUser2">Hey2, {{ currentUser2.name }}</n-p>
      <n-p v-if="currentUser3">Hey3, {{ currentUser3.name }}</n-p> -->
      <n-button @click="handleClick">开始考试</n-button>
    </template>
  </n-result>
</template>

<script lang="ts" setup>
// import { ref } from 'vue'
// import { useCurrentUser, User } from '../composables'
// import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';

const router = useRouter();
// const currentUser1 = ref<User | null>(null)
// const currentUser2 = ref<User | null>(null)
// const currentUser3 = ref<User | null>(null)
// const message = useMessage();

const handleClick = (): void => {
  // message.success('Just So So');
  router.push({ name: 'exam', });
  // const {  } = useCurrentUser()
  // const {  } = useCurrentUser()
  // const {  } = useCurrentUser()
};
</script>

<style scoped>
.n-result {
  margin: 10vh 0;
}
</style>
