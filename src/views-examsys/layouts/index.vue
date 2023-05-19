<template>
  <n-layout position="absolute" has-sider>
    <Sidebar />
    <n-layout>
      <Header />
      <Content />
      <Footer />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import Sidebar from './Sidebar'
import Header from './header.vue'
import Content from './content.vue'
import Footer from './footer.vue'
// workbench
</script>
