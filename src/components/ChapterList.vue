<template>
  <a-collapse v-model:activeKey="activeKey" @change="changeActivekey">
    <a-collapse-panel key="1" header="This is panel header 1">
      <a-collapse default-active-key="4">
        <a-collapse-panel key="4" header="This is panel nest panel">
          <p>{{ text }}</p>
        </a-collapse-panel>
      </a-collapse>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="This is panel header 2">
      <p>{{ text }}</p>
    </a-collapse-panel>
    <a-collapse-panel key="3" header="This is panel header 3">
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup lang="ts">

interface ListData {
  key: string,
  text: string
}

const props = defineProps<{
  activeKey: string[],
  dataSource: ListData[]
}>()

// const emit = defineEmits<{
//   (e: "changeActivekey")
// }>()
</script>

<style scoped>

</style>