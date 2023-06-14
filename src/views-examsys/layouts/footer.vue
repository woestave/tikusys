<template>
  <n-layout-footer>
    <n-p>
      <n-a href="https://www.reachedtrain.com" target="_blank">北京锐时达科技有限公司</n-a>
      <n-text>京ICP备17029198号-2</n-text>
      <n-text>京公网安备110778776675522</n-text>
    </n-p>
    <n-p>&copy; {{ new Date().getFullYear() }} All rights reserved.</n-p>
  </n-layout-footer>
</template>

<style scoped>
.n-layout-footer {
  opacity: 0.6;
  padding: 30px;
  text-align: center;
}
.n-a {
  text-decoration: none;
}

.n-text {
  margin-left: 24px;
}
.n-p {
  font-size: 12px;
}
</style>
