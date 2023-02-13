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
            <div class="content-item-label">所属分类</div>
            <div>
              <select class="classification-input form-input" v-model="classificationLevel1Id">
                <option value="0">未选择</option>
                <option v-for="classification in classificationArray"
                        :key="classification.id"
                        :value="classification.id">{{ classification.name }}</option>
              </select>

              <select class="classification-input" v-show="isHaveChildren" v-model="classificationLevel2Id">
                <option value="0">未选择</option>
                <option v-for="classification in currentClassificationLevel2Array"
                        :key="classification.id"
                        :value="classification.id">{{ classification.name }}</option>
              </select>
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-label">课程名称</div>
            <input class="form-input" v-model="name"/>
          </div>
          <div class="content-item">
            <div class="content-item-label">课程封面</div>
            <a-upload
                v-model:file-list="fileList"
                name="file"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :action="uploadUrl"
                :before-upload="beforeUpload"
                @change="handleChange"
            >
              <img v-if="imageUrl" :src="imageUrl" id="file-avatar" alt="avatar" />
              <div v-else>
                <loading-outlined v-if="uploadLoading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
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
import {computed, ref, watch, watchEffect} from "vue";
import {useAxios} from "@vueuse/integrations/useAxios";
import {DataResponse, ListResponse} from "@/api/Response";
import {Api} from "@/api";
import {Course, CreateOrUpdateCourseRequest} from "@/models/Course";
import {SelectProps} from "ant-design-vue/lib/select";
import {message, UploadFile} from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';

const props = defineProps<{
  show: boolean,
  data?: Course,
}>();

const emit = defineEmits<{
  (e: "ok"): void
  (e: "cancel"): void
}>()


const isAdd = computed<boolean>(() => {
  return props.data === undefined;
})

const uploadUrl = Api.UploadImg;
const fileList = ref([]);
const uploadLoading = ref<boolean>(false);
const imageName = ref<string>("");
const imageUrl = computed<string>(() => {
  if (imageName.value.length == 0){
    return "";
  }
  return import.meta.env.VITE_SERVICE_ADDRESS + "/files/" + imageName.value;
});

const classificationArray = ref<Classification[]>();
const currentClassificationLevel2Array = ref<Classification[]>();
const classificationLevel1Options = ref<SelectProps['options']>([]);

const classificationLevel1Id = ref<number>(0);
const classificationLevel2Id = ref<number>(0);

const name = ref<string>(props.data?.name ?? "");
watch(() => props.data, async (course) => {
  console.log(course);
  if (course){
    name.value = course.name;
    imageName.value = course.coverUrl;
    const { data } = await useAxios<DataResponse<Classification>>(Api.GetClassification(course.classificationId));
    if(!data.value || !data.value.success){
      return
    }
    if(data.value?.data.level == 1){
      classificationLevel1Id.value = data.value?.data.id;
    } else {
      classificationLevel1Id.value = data.value?.data.parentId;
      classificationLevel2Id.value = data.value?.data.id;
    }
  } else {
    imageName.value = "";
    name.value = "";
    classificationLevel1Id.value = 0;
  }
});

const isHaveChildren = computed<boolean>(() => {
  return currentClassificationLevel2Array.value !== undefined && currentClassificationLevel2Array.value !== null;
})

watch(classificationLevel1Id, () => {
  currentClassificationLevel2Array.value = undefined;
  const foundClassification = classificationArray.value?.find<Classification>(item => item.id == classificationLevel1Id.value);
  if(!foundClassification){
    return;
  }
  currentClassificationLevel2Array.value = foundClassification.children;
});

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
  });
}

loadClassification();


const handleChange = (info: UploadChangeParam<UploadFile<DataResponse<string>>>) => {
  console.log(info);

  if (info.file.status === 'uploading') {
    uploadLoading.value = true;
    return;
  }
  if (info.file.status === 'done' && info.file.response?.success) {
    imageName.value = info.file.response.data;
    uploadLoading.value = false;
  }
  if (info.file.status === 'error' || !info.file.response?.success) {
    uploadLoading.value = false;
    message.error('upload error');
  }
};

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

function ok(){
  if (name.value.length == 0){
    alert("必须输入课程名称！");
    return;
  }
  if (imageName.value.length == 0){
    alert("必须上传课程封面！");
    return;
  }
  if (classificationLevel1Id.value == 0){
    alert("必须选择课程所属分类！");
    return;
  }
  if (props.data === undefined){
    create();
  } else {
    update(props.data.id);
  }
}

function create(){
  let cId: number;
  if(classificationLevel2Id.value != 0){
    cId = classificationLevel2Id.value;
  } else {
    cId = classificationLevel1Id.value;
  }
  const c = new CreateOrUpdateCourseRequest(cId, name.value, imageName.value);
  const { data, isFinished, error } = useAxios<DataResponse<Course>>(Api.CreateCourse, {
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

function update(id: number){
  let cId: number;
  if(classificationLevel2Id.value != 0){
    cId = classificationLevel2Id.value;
  } else {
    cId = classificationLevel1Id.value;
  }
  const c = new CreateOrUpdateCourseRequest(cId, name.value, imageName.value);
  const { data, isFinished, error } = useAxios<DataResponse<Course>>(Api.UpdateCourse(id), {
    method: "PUT",
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


watch(() => props.show, (value)=> {
  // if(!value){
  //   imageName.value = "";
  //   uploadLoading.value = false;
  //   fileList.value = [];
  //   name.value = "";
  //   classificationLevel1Id.value = 0;
  // }
});
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
  width: 320px;
}

.content-item-label {
  margin-right: 8px;
  width: 56px;
}

.footer-content {
  display: flex;
  justify-content: end;
}


.classification-input {
  /*width: 100px;*/
}

.form-input {
  flex-grow: 1;
}

#file-avatar {
  width: 100px;
  height: 100px;
}
.avatar-uploader {
  width: auto;
}
</style>