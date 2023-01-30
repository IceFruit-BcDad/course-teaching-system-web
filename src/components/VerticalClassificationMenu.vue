<template>
  <div class="container">
    <div class="menu-item">
      <a class="item-title" href="#">国家精品</a>
      <span class="item-child">
        <template v-for="(item, index) in menuItems" :key="item">
          <a href="#">{{ item }}</a>
          <span v-if="index + 1 != menuItems?.length"> / </span>
        </template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from "vue";

const menuItems = ref<Array<string>|null>(["大数据", "人工智障", "测试项"])
</script>

<style scoped>
.container {
  width: 14rem;
  display: flex;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: .4rem;
  background-color: white;
}

.menu-item {
  padding: .2rem 1rem;
  overflow: hidden; /* 超出的文本隐藏 */
  text-overflow: ellipsis; /* 溢出用省略号 */
  white-space: nowrap;
}

.menu-item:hover {
  background-color: var(--color-block-light-hover);
  color: var(--color-text-hover);

  /* animation: a-text-color-hover 0.2s normal; */
}

@keyframes a-text-color-hover {
  from {
    color: black;
  }

  to {
    color: var(--color-text-hover);
  }
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.item-title {
  flex-shrink: 0;
}

.item-child {
  margin-left: .3rem;
  font-size: .85rem;
}

.item-child > a {
  color: inherit;
}
</style>