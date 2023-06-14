<!-- Sign In -->

<template>
  <n-h1 style="--font-size: 60px; --font-weight: 100">
    <!-- {{ userStore.userRole }} -->
    {{ CONST_COMMON.COM_NAME_CN + '学生考试系统' }}
  </n-h1>
  <n-card size="large" style="--padding-bottom: 30px">
    <n-h2 style="--font-weight: 400">Sign-in</n-h2>
    <n-form size="large" :rules="rules" :model="model">
      <n-form-item-row label="Username" path="username">
        <n-input v-model:value="model.username" placeholder="学生姓名" @keydown.enter="handleLogin" />
      </n-form-item-row>
      <n-form-item-row label="Password" path="password">
        <n-input v-model:value="model.password" type="password" placeholder="密码" @keydown.enter="handleLogin" />
      </n-form-item-row>
    </n-form>
    <n-button type="primary" size="large" block :loading="loading" :disabled="disabled" @click="handleLogin">Sign in</n-button>
    <br>
  </n-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
// @ts-ignore
import { CONST_COMMON } from 'common-packages/constants/common';
import examsysServices from '@/apis/services/examsys';
import { tokens } from '@/apis/request';
import { useCommonDataPinia } from '@/store/common-data.pinia';

const router = useRouter();

const RSD_EXAMSYS_PREV_LOGIN_UNAME = 'RSD_EXAMSYS_PREV_LOGIN_UNAME';

const rules = {
  username: {
    required: true,
    message: '请输入学生姓名',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
};

const model = ref({
  username: localStorage.getItem(RSD_EXAMSYS_PREV_LOGIN_UNAME) || '',
  password: '',
});

const loading = ref(false);
const commonData = useCommonDataPinia();

const disabled = computed<boolean>(() => model.value.username === '' || model.value.password === '');

const handleLogin = async (e: Event): Promise<void> => {
  e.preventDefault()
  loading.value = true;
  examsysServices
    .login(model.value)
    .then((res) => {
      localStorage.setItem(RSD_EXAMSYS_PREV_LOGIN_UNAME, model.value.username);
      tokens.setToken(res.data.token);
      // const route = router.currentRoute.value;
      // const redirect = route.query.redirect?.toString();
      commonData.fetchCommonData().then(() => {
        // router.replace(redirect ?? route.redirectedFrom?.fullPath ?? '/');
        router.replace('/');
      });
    }).catch((e) => {
    }).finally(() => {
      loading.value = false;
    });
}

</script>

<style scoped>
.n-h1 {
  margin: 20vh auto 20px;
  text-align: center;
  letter-spacing: 5px;
  opacity: 0.8;
}

.n-card {
  margin: 0 auto;
  max-width: 380px;
  box-shadow: var(--box-shadow);
}
</style>
