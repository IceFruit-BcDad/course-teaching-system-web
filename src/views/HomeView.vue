<script setup lang="ts">
import VerticalClassificationMenuVue from '@/components/VerticalClassificationMenu.vue';
</script>

<template>
  <div class="container">
    <VerticalClassificationMenuVue id="vcm" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
}

#vcm {
  height: 360px;
}
</style>