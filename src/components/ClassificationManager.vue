<template>
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <Modal :show="show">
      <template #header>
        <h3>{{ isAdd ? "新增" : "编辑" }}课程分类</h3>
      </template>
      <template #body>
        <div class="content">
          <div class="content-item">
            <label class="content-item-label" for="level-input">分类等级</label>
            <input id="level-input" :value="level" disabled/>
          </div>
          <div class="content-item">
            <label class="content-item-label" for="name-input">分类名称</label>
            <input id="name-input" v-model="name"/>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="footer-content">
          <CtsButton @click="ok">{{ isAdd ? "新增" : "更新" }}</CtsButton>
          <CtsButton @click="$emit('cancel')">取消</CtsButton>
        </div>
      </template>
    </Modal>
  </Teleport>
</template>

<script setup lang="ts">
import CtsButton from "@/components/CtsButton.vue";
import Modal from "@/components/Modal.vue";
import {Classification} from "@/models/Classification";
import {computed, ref, watch} from "vue";
import {useAxios} from "@vueuse/integrations/useAxios";
import {DataResponse, ListResponse} from "@/api/Response";
import {Api} from "@/api";
import axios from "axios";
import {CreateOrUpdateClassificationRequest} from "@/models/CreateOrUpdateClassificationRequest";

const props = defineProps<{
  show: boolean,
  data?: Classification,
  level: number,
  parentId?: bigint
}>();

const emit = defineEmits<{
  (e: "ok"): void
  (e: "cancel"): void
}>()

const isAdd = computed<boolean>(() => {
  return props.data === undefined;
})

const level = computed<number>(() => {
  if (props.data !== undefined){
    return props.data.level;
  }
  return props.level;
})

const name = ref<string>(props.data?.name ?? "");

function ok(){
  if (name.value.length == 0){
    alert("必须输入分类名称！");
    return;
  }
  if (props.data === undefined){
    create();
  } else {
    update(props.data.id, props.data.level)
  }
}

function create(){
  const c = new CreateOrUpdateClassificationRequest(level.value, name.value)
  if (level.value === 2){
    c.parentId = props.parentId;
  }
  console.log(c);
  const { data, isFinished, error } = useAxios<DataResponse<Classification>>(Api.CreateClassification, {
    method: "post",
    data: c
  });
  watch(isFinished, () => {
    if (error.value){
      alert(error.value);
      return;
    }
    if (!data.value?.success){
      alert(data.value?.message ?? "数据异常");
      return;
    }
    emit("ok");
  })
}

function update(id: bigint, level: number){
  const c = new CreateOrUpdateClassificationRequest(level, name.value)
  const { data, isFinished, error } = useAxios<DataResponse<Classification>>(Api.UpdateClassification(id), {
    method: "PUT",
    params: c
  });
  watch(isFinished, () => {
    if (error){
      alert(error);
      return;
    }
    if (!data.value?.success){
      alert(data.value?.message ?? "数据异常");
      return;
    }
    emit("ok");
  })
}
</script>

<style scoped>

.content {
  display: flex;
  flex-direction: column;
}

.content-item {
  display: flex;
  align-items: center;
  padding: 12px;
}

.content-item-label {
  margin-right: 8px;
}

.footer-content {
  display: flex;
  justify-content: end;
}
</style>