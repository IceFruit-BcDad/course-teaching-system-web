<template>
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <Modal :show="show">
      <template #header>
        <h3>{{ isAdd ? "新增" : "编辑" }}课程</h3>
      </template>
      <template #body>
        <div class="content">
          <div class="content-item">
            <label class="content-item-label" for="classification-input">所属分类</label>
            <select id="classification-input" v-model="classificationId">
              <option value="0">未选择</option>
              <option v-for="classification in classificationArray"
                      :key="classification.id"
                      :value="classification.name">{{ classification.name }}</option>
            </select>
<!--            <a-space>-->
<!--              <a-select id="classification-input" style="width: 120px">-->
<!--                <a-select-option v-for="classification in classificationArray"-->
<!--                                 :value="classification.name">{{ classification.name }} 1</a-select-option>-->
<!--              </a-select>-->
<!--            </a-space>-->
          </div>
          <div class="content-item">
            <label class="content-item-label" for="name-input">课程名称</label>
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
import {Course} from "@/models/Course";
import {SelectProps} from "ant-design-vue";

const props = defineProps<{
  show: boolean,
  data?: Course,
  classificationId?: number
}>();

const emit = defineEmits<{
  (e: "ok"): void
  (e: "cancel"): void
}>()

const isAdd = computed<boolean>(() => {
  return props.data === undefined;
})

const name = ref<string>(props.data?.name ?? "");
watch(() => props.data?.name, (value) => {
  name.value = value ?? "";
});

const classificationId = ref<number>(props.data?.classificationId ?? 0);
watch(() => props.data?.classificationId, (value) => {
  classificationId.value = value ?? 0;
});

const classificationArray = ref<Classification[]>();
const classificationLevel1Options = ref<SelectProps['options']>([]);

function loadClassification(){
  const { data, isFinished } = useAxios<ListResponse<Classification>>(Api.GetClassifications);
  watch(isFinished, () => {
    if(!data.value || !data.value.success){
      return
    }
    classificationArray.value = data.value.data.list;
    classificationLevel1Options.value = []
    for (let i = 0; i < classificationArray.value?.length; i++){
      const item = classificationArray.value[i];
      classificationLevel1Options.value.push({
        value: item.id,
        label: item.name
      })
    }
    console.log(classificationLevel1Options.value);
  });
}

loadClassification();

function ok(){
  // if (name.value.length == 0){
  //   alert("必须输入分类名称！");
  //   return;
  // }
  // if (props.data === undefined){
  //   create();
  // } else {
  //   update(props.data.id, props.data.level, props.data.parentId)
  // }
}

// function create(){
//   const c = new CreateOrUpdateClassificationRequest(level.value, name.value)
//   if (level.value === 2){
//     c.parentId = props.parentId;
//   }
//   console.log(c);
//   const { data, isFinished, error } = useAxios<DataResponse<Classification>>(Api.CreateClassification, {
//     method: "post",
//     data: c
//   });
//   watch(isFinished, () => {
//     if (error.value){
//       alert(error.value);
//       return;
//     }
//     if (!data.value?.success){
//       alert(data.value?.message ?? "数据异常");
//       return;
//     }
//     emit("ok");
//   })
// }
//
// function update(id: number, level: number, parentId: number){
//   const c = new CreateOrUpdateClassificationRequest(level, name.value)
//   c.parentId = parentId;
//   const { data, isFinished, error } = useAxios<DataResponse<Classification>>(Api.UpdateClassification(id), {
//     method: "PUT",
//     data: c
//   });
//   watch(isFinished, () => {
//     if (error.value){
//       alert(error.value);
//       return;
//     }
//     if (!data.value?.success){
//       alert(data.value?.message ?? "数据异常");
//       return;
//     }
//     emit("ok");
//   })
// }
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