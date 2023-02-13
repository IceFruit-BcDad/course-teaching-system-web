<template>
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <Modal :show="show">
      <template #header>
        <h3>{{ isAdd ? "新增" : "编辑" }}章节</h3>
      </template>
      <template #body>
        <div class="content">
          <div class="content-item">
            <div class="content-item-label">章节名称</div>
            <input class="form-input" v-model="chapterTitle"/>
          </div>
          <div class="content-item">
            <div class="content-item-label">章节内容</div>
            <a-upload
                v-model:file-list="fileList"
                name="file"
                class="avatar-uploader"
                :action="uploadUrl"
                :before-upload="beforeUpload"
                @change="handleChange"
            >
              <upload-outlined></upload-outlined>
              上传章节内容文件
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
import {computed, ref, watch, watchEffect} from "vue";
import {DataResponse, ListResponse} from "@/api/Response";
import {Api} from "@/api";
import {message, UploadFile} from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import {Chapter, CreateOrUpdateChapterRequest} from "@/models/Chapter";
import 'ant-design-vue/es/message/style/css';
import { UploadOutlined } from "@ant-design/icons-vue";
import {useAxios} from "@vueuse/integrations/useAxios";


const props = defineProps<{
  show: boolean,
  data?: Chapter,
  courseId: number,
  parentId?: number
}>();

const emit = defineEmits<{
  (e: "ok"): void
  (e: "cancel"): void
}>()


const isAdd = computed<boolean>(() => {
  return props.data === undefined;
})

const uploadUrl = Api.Upload;
const fileList = ref([]);
const uploadLoading = ref<boolean>(false);
const fileName = ref<string>("");


const chapterTitle = ref<string>(props.data?.title ?? "");
watch(() => props.data, async (chapter) => {
  console.log(chapter);
  if (chapter){
    chapterTitle.value = chapter.title;
    fileName.value = chapter.contentUrl;
  } else {
    fileList.value = []
    fileName.value = "";
    chapterTitle.value = "";
  }
});


const handleChange = (info: UploadChangeParam<UploadFile<DataResponse<string>>>) => {
  console.log(info);

  if (info.file.status === 'uploading') {
    uploadLoading.value = true;
    return;
  }
  if (info.file.status === 'done' && info.file.response?.success) {
    fileName.value = info.file.response.data;
    uploadLoading.value = false;
  }
  if (info.file.status === 'error' || !info.file.response?.success) {
    uploadLoading.value = false;
    message.error('upload error');
  }
};

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  console.log(file.type);
  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isLt2M;
};

function ok(){
  if (chapterTitle.value.length == 0){
    message.error("必须输入课程名称！");
    return;
  }
  if (fileName.value.length == 0){
    message.error("必须上传章节内容文件！");
    return;
  }
  if (props.data === undefined){
    create();
  } else {
    update(props.data.id);
  }
}

function create(){
  const c = new CreateOrUpdateChapterRequest(props.courseId, chapterTitle.value);
  c.parentId = props.parentId;
  c.contentUrl = fileName.value;
  const { data, isFinished, error } = useAxios<DataResponse<Chapter>>(Api.CreateOrUpdateChapter, {
    method: "post",
    data: c
  });
  watch(isFinished, () => {
    if (error.value){
      message.error(error.value.message);
      return;
    }
    if (!data.value?.success){
      message.error(data.value?.message ?? "数据异常");
      return;
    }
    emit("ok");
  })
}

function update(id: number){
  const c = new CreateOrUpdateChapterRequest(props.courseId, chapterTitle.value);
  c.parentId = props.parentId;
  c.contentUrl = fileName.value;
  c.chapterId = id;
  const { data, isFinished, error } = useAxios<DataResponse<Chapter>>(Api.CreateOrUpdateChapter, {
    method: "PUT",
    data: c
  });
  watch(isFinished, () => {
    if (error.value){
      message.error(error.value.message);
      return;
    }
    if (!data.value?.success){
      message.error(data.value?.message ?? "数据异常");
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