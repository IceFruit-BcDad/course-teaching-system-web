<template>
  <button class="cts-btn">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">

</script>

<style scoped>
.cts-btn {
  line-height: 1.5715;
  font-weight: 400;
  border: 1px solid #d9d9d9;
  box-shadow: 0 2px #00000004;
  cursor: pointer;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;
  color: #000000d9;
  margin-right: 8px;
  margin-bottom: 12px;
}
.cts-btn:hover {
  border-color: var(--vt-c-main);
  color: var(--vt-c-main);
}
.cts-btn[disabled] {
  background: #f5f5f5;
  color: #00000040;
  border-color: #d9d9d9;
  cursor: not-allowed;
}
</style>