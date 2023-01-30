<script setup lang="ts">
import VerticalClassificationMenuVue from '@/components/VerticalClassificationMenu.vue';
import NavigationBar from "@/components/NavigationBar.vue";
</script>

<template>
  <header>
    <NavigationBar />
  </header>
  <main>
    <div class="container">
      <VerticalClassificationMenuVue />
    </div>
  </main>
</template>

<style scoped>
header {
  /* width: 100%; */
  position: fixed;
  height: 4rem;
  /* height: 100px; */
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}

main {
  width: 1200px;
  margin: 6rem auto;
}
.container {
  display: flex;
}
</style>