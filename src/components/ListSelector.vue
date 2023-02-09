<template>
  <div class="list-selector">
    <div class="list-selector-header">
      <CtsButton :disabled="!isCanAdd" @click="$emit('add')">新增</CtsButton>
      <CtsButton :disabled="selectedKeys.length === 0" @click="$emit('delete', selectedKeys)">删除</CtsButton>
      <CtsButton :disabled="selectedKeys.length !== 1" @click="$emit('edit', selectedKeys[0])">编辑</CtsButton>
    </div>
    <div class="list-selector-body">
      <ul v-if="dataSource?.length > 0" class="list-selector-content">
        <li class="list-selector-content-item" v-for="item in dataSource" :key="item.key" @click="itemTrigger(item.key)">
          <span class="list-selector-content-item-checkbox">
            <input type="checkbox" class="cts-checkbox" :checked="selectedKeys.includes(item.key)"/>
          </span>
          <span class="list-selector-content-item-text">{{ item.title }}</span>
        </li>
      </ul>
      <img v-else class="list-selector-empty" src="../assets/empty.png">
    </div>
  </div>
</template>

<script setup lang="ts">
import CtsButton from "@/components/CtsButton.vue";
import {computed, ref} from "vue";
interface Props {
  dataSource: Data[],
  selectedKeys: string[],
  isCanAdd: boolean
}

interface Data {
  key: string;
  title: string;
  description: string;
}


const props = withDefaults(defineProps<Props>(), {
  isCanAdd: true
});

const emit = defineEmits<{
  (e: "update:selected-keys", value: string[]): void
  (e: "add"): Data
  (e: "edit", value: string): void
  (e: "delete", value: string[]): void
}>()

const selectedKeys = ref<string[]>(props.selectedKeys);

function itemTrigger(key: string){
  const index = selectedKeys.value.indexOf(key);
  if (index == -1){
    selectedKeys.value.push(key);
  } else {
    selectedKeys.value.splice(index, 1);
  }
  emit("update:selected-keys", selectedKeys.value);
}
</script>

<style scoped>
.list-selector {
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.list-selector-header {
  padding: 10px 10px 0px 10px;
  border-bottom: 1px solid #d9d9d9;
  /*height: px;*/
}

.list-selector-body {
  display: flex;
  flex: auto;
  flex-direction: column;
  overflow: hidden;
}

.list-selector-content {
  overflow: auto;
  list-style: none;
  padding: 0;
}

.list-selector-content-item {
  padding: 6px 12px;
  line-height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.list-selector-content-item:hover {
  background-color: #d9d9d9;
}

.cts-checkbox {
  width: 16px;
  height: 16px;
  z-index: 1;
  cursor: pointer;
}

.list-selector-content-item-checkbox {
  margin-right: 8px;
  display: inline-flex;
}

.list-selector-empty {
  width: 38%;
  align-self: center;
  margin-top: 30%;
  /*height: 50%;*/
}
</style>