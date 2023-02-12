<template>
  <div class="admin-classification">
    <div class="classification-container">
      <div>一级课程分类</div>
      <ListSelector class="list-selector-level1"
                    :data-source="level1Classification"
                    v-model:selected-keys="level1SelectedKeys"
                    @add="addLevel1Classification"
                    @delete="deleteClassification(1)"
                    @edit="(key) => editClassification(1, key)"
      />
    </div>
    <img id="arrow-right" src="../assets/arrow_right.png">
    <div class="classification-container">
      <div>{{ currentCanEditLevel1 !== undefined ? currentCanEditLevel1.name : "" }}二级课程分类</div>
      <ListSelector class="list-selector-level2"
                    :data-source="level2Classification"
                    v-model:selected-keys="level2SelectedKeys"
                    :is-can-add="level1SelectedKeys?.length === 1"
                    @add="addLevel2Classification"
                    @delete="deleteClassification(2)"
                    @edit="(key) => editClassification(2, key)"
      />
    </div>
    <ClassificationManager :show="modalData.modalStatus"
                           :level="modalData.level"
                           :data="modalData.data"
                           :parent-id="modalData.parentId"
                           @ok="ok"
                           @cancel="cancel"
    />
  </div>
</template>

<script setup lang="ts">
import ListSelector from "@/components/ListSelector.vue";
import {computed, reactive, ref, watch, watchEffect} from "vue";
import {Classification} from "@/models/Classification";
import {useAxios} from "@vueuse/integrations/useAxios";
import {Response, ListResponse} from "@/api/Response";
import {Api} from "@/api";
import ClassificationManager from "@/components/ClassificationManagerModal.vue";
import {User} from "@/models/User";
import {useUserStore} from "@/stores/user";

interface Modal {
  modalStatus: boolean
  level: number
  data?: Classification
  parentId?: number
}

const modalData: Modal = reactive({ modalStatus: false, level: 1 });

interface Data {
  key: string;
  title: string;
  description: string;
}
const level1Classification = ref<Data[]>([]);
const level2Classification = ref<Data[]>([]);

const level1SelectedKeys = ref<string[]>([]);
const level2SelectedKeys = ref<string[]>([]);

const currentCanEditLevel1 = ref<Classification>()

const classificationArray = ref<Array<Classification>>()

function loadData(){
  const { data, isFinished } = useAxios<ListResponse<Classification>>(Api.GetClassifications);
  watch(isFinished, () => {
    if(!data.value || !data.value.success){
      return
    }
    classificationArray.value = data.value.data.list;
    level1Classification.value.splice(0);
    for (let i = 0; i < classificationArray.value?.length; i++){
      let item = classificationArray.value[i];
      level1Classification.value.push({
        key: item.id.toString(),
        title: item.name,
        description: item.name
      });
    }
  });
}

loadData();


const isShowLevel2 = computed<boolean>(() => {
  return level1SelectedKeys.value.length === 1;
});

watchEffect(() => {
  if(!isShowLevel2.value){
    currentCanEditLevel1.value = undefined;
    level2Classification.value = [];
    return;
  }
  const selectedLevel1: Classification | undefined = classificationArray.value?.find<Classification>(item => item.id.toString() === level1SelectedKeys.value[0]);
  currentCanEditLevel1.value = selectedLevel1;
  if (!selectedLevel1 || selectedLevel1.children === null || selectedLevel1.children?.length == 0){
    level2Classification.value = [];
    return;
  }
  level2Classification.value = [];
  for (let i = 0; i < selectedLevel1.children.length; i++){
    let item = selectedLevel1.children[i];
    level2Classification.value.push({
      key: item.id.toString(),
      title: item.name,
      description: item.name
    });
  }
});

function addLevel1Classification(){
  modalData.level = 1;
  modalData.modalStatus = true;
  modalData.parentId = undefined;
  modalData.data = undefined;
}

function addLevel2Classification(){
  modalData.level = 2;
  modalData.parentId = currentCanEditLevel1.value?.id
  modalData.modalStatus = true;
  modalData.data = undefined;
}

function editClassification(level: number, key: string){
  // modalData.data
  let c: Classification | undefined
  if (level == 1){
    c = currentCanEditLevel1.value;
  } else {
    c = currentCanEditLevel1.value?.children
        .find<Classification>(item => item.id.toString() === key);
  }
  if (!c){
    alert("未找到对应分类");
    return;
  }
  modalData.data = c;
  modalData.modalStatus = true;
}

function deleteClassification(level: number){
  let ids: string
  if (level == 1){
    ids = level1SelectedKeys.value.join(",");
  } else {
    ids = level2SelectedKeys.value.join(",");
  }
  const { data, isFinished, error } = useAxios<Response>(Api.DeleteClassifications(ids), {
    method: "delete"
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
    loadData();
  })
}

function ok(){
  modalData.modalStatus = false;
  loadData();
}

function cancel(){
  modalData.modalStatus = false;
}
</script>

<style scoped>

.admin-classification {
  display: flex;
  justify-content: space-around;
}

.classification-container {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 600px;
}

.list-selector-level1 {

}

#arrow-right {
  width: 40px;
  height: 40px;
  align-self: center;
}
</style>