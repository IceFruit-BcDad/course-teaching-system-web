<template>
  <div id="container">
    <div id="content-header">
      <img id="course-cover-img" :src="imageUrl"/>
      <div id="course-info">
        <h2 style="font-weight:bold;">{{ course?.name }}</h2>
        <div id="course-info-detail">
          <div>课程分类：{{ course?.classificationName }}</div>
          <div>主章节数：{{ course?.chapters?.length ?? 0 }}</div>
          <div>创建时间：{{ course?.createTime }}</div>
          <div>修改时间：{{ course?.lastModifyTime }}</div>
          <div>课程老师：{{ course?.createUserName }}</div>
        </div>
      </div>
    </div>
    <div id="content-body">
      <a-table :columns="columns"
               :data-source="tableData.dataSource"
               :pagination="false"
               :loading="tableData.isLoading"
               :row-key="(record) => record.id"
      >
        <template #bodyCell="{ record, column }">
          <template v-if="column.key === 'action'">
            <a @click="readChapter(record.id, record.contentUrl)">阅读</a>
<!--            <a style="margin-left: 10px;" @click="editChapter(record.id)">编辑</a>-->
<!--            <a-popconfirm title="确定要删除该章节吗?包含的章节也将一起彻底删除！"-->
<!--                          ok-text="确定" cancel-text="取消"-->
<!--                          @confirm="deleteChapter(record.id)">-->
<!--              <a style="margin-left: 10px;">删除</a>-->
<!--            </a-popconfirm>-->
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, reactive, ref} from "vue";
import {Course} from "@/models/Course";
import {useAxios} from "@vueuse/integrations/useAxios";
import {Api} from "@/api";
import {DataResponse, ListResponse} from "@/api/Response";
import {message} from "ant-design-vue";
import 'ant-design-vue/es/message/style/css';
import {Chapter} from "@/models/Chapter";
import {useRouter} from "vue-router";

const props = defineProps<{
  courseId: string
}>()

const columns = [
  { title: '章节名称', dataIndex: 'title', key: 'title', width: "30%", fixed: false },
  { title: '修改时间', dataIndex: 'lastModifyTime', width: "30%", key: 'lastModifyTime' },
  { title: '操作', width: "30%", key: 'action' },
];

interface TableData {
  dataSource: Chapter[];
  isLoading: boolean
}

const tableData: TableData = reactive({
  dataSource: [],
  isLoading: false
})

const course = ref<Course>();
const imageUrl = computed<string>(() => {
  if (!course.value){
    return "";
  }
  if (course.value.coverUrl.length == 0){
    return "";
  }
  return import.meta.env.VITE_SERVICE_ADDRESS + "/files/" + course.value.coverUrl;
});

async function loadChapters(courseId: number){
  tableData.dataSource = []
  const { data, error } = await useAxios<ListResponse<Chapter>>(Api.GetChapters(courseId));
  if (error.value){
    message.error(error.value.message);
    return;
  }
  if(!data.value || !data.value.success){
    message.error(data.value?.message ?? "获取章节数据失败")
    return
  }
  if (data.value?.data){
    tableData.dataSource = data.value?.data.list;
  }
}

async function loadCourse(){
  const courseId = parseInt(props.courseId);
  tableData.isLoading = true;
  const { data, error } = await useAxios<DataResponse<Course>>(Api.GetCourse(courseId));
  if (error.value){
    message.error(error.value.message);
    return;
  }
  if(!data.value || !data.value.success){
    message.error(data.value?.message ?? "获取课程数据失败")
    return
  }
  course.value = data.value?.data;
  await loadChapters(courseId);
  tableData.isLoading = false;
}

loadCourse()

const router = useRouter();

function readChapter(courseId: number, contentUrl: string){
  let newpage = router.resolve("/md/" + contentUrl.split(".")[0])
  window.open(newpage.href, '_blank');
  // router.push("/md/" + contentUrl.split(".")[0] + "?courseId=" + courseId);
}
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
}

#content-header {
  display: flex;
  background: white;
  padding: 10px;
  border-radius: 4px;
}

#course-cover-img {
  width: 510px;
  height: 280px;
  border-radius: 4px;
}

#course-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
}

#course-info-detail {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fb;
  border-radius: 4px;
  margin-right: 100px;
  margin-bottom: 60px;
  padding: 10px;
}

#content-body {
  display: flex;
  background: white;
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
  height: 100%;
  flex-direction: column;
}
</style>