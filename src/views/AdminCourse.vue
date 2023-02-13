<template>
  <div>
    <div style="margin-bottom: 16px">
      <CtsButton @click="addCourse">新增课程</CtsButton>
    </div>

    <a-table :columns="columns"
             :data-source="tableData.dataSource"
             :pagination="pagination"
             :loading="tableData.isLoading"
             @change="handleTableChange"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'action'">
          <a @click="moreCourse(record.id)">详情</a>
          <a @click="editCourse(record.id)" style="margin-left: 10px;">编辑</a>
          <a-popconfirm title="确定要删除该课程吗?包含的章节也将一起彻底删除！"
                        ok-text="确定" cancel-text="取消"
                        @confirm="deleteCourse(record.id)">
            <a style="margin-left: 10px;">删除</a>
          </a-popconfirm>
        </template>
      </template>
      <!--    <template #expandedRowRender="{ record }">-->
      <!--      <a-table style="margin: 0" :columns="chapterColumns" :data-source="record.chapters"  :scroll="{ x: 2000 }"></a-table>-->
      <!--&lt;!&ndash;      <p style="margin: 0">&ndash;&gt;-->
      <!--&lt;!&ndash;        {{ record.description }}&ndash;&gt;-->
      <!--&lt;!&ndash;      </p>&ndash;&gt;-->
      <!--    </template>-->
    </a-table>

    <CourseManagerModal :show="modalData.modalStatus" :data="modalData.data" @cancel="modalCancel" @ok="modalOk"/>
  </div>
</template>

<script setup lang="ts">
import {useAxios} from "@vueuse/integrations/useAxios";
import {DtoList, ListResponse, Response} from "@/api/Response";
import {Api} from "@/api";
import {computed, reactive, watch} from "vue";
import {Course} from "@/models/Course";
import type {TableProps} from "ant-design-vue";
import CtsButton from "@/components/CtsButton.vue";
import CourseManagerModal from "@/components/CourseManagerModal.vue";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";

interface Modal {
  modalStatus: boolean,
  data?: Course
}

interface TableData {
  dataSource: Course[];
  limit: number;
  offset: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
}

const router = useRouter();

const modalData: Modal = reactive({ modalStatus: false});

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: "30%", fixed: false },
  { title: '分类', dataIndex: 'classificationName', key: 'classificationName', width: "30%" },
  { title: '操作', key: 'action', width: "30%" },
];

const tableData: TableData = reactive({
  dataSource: [],
  limit: 10,
  offset: 0,
  total: 0,
  totalPages: 0,
  isLoading: false
})

const pagination = computed(() => ({
  total: tableData.total,
  current: tableData.offset / tableData.limit + 1,
  pageSize: tableData.limit,
}));

function handleTableChange(pag: any){
  console.log(pag);
  loadData(pag.current * tableData.limit);
}

function loadData(offset: number = 0){
  const { data, isFinished } = useAxios<ListResponse<Course>>(Api.GetCourses(offset, tableData.limit));
  watch(isFinished, () => {
    if(!data.value || !data.value.success){
      return
    }
    tableData.dataSource = data.value.data.list;
    tableData.offset = data.value?.data.offset;
    tableData.total = data.value?.data.total;
    tableData.totalPages = data.value?.data.totalPages;
    console.log(tableData);
  });
}

loadData();

function deleteCourse(id: number){
  const { data, isFinished, error } = useAxios<Response>(Api.DeleteCourse(id), {
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

function editCourse(id: number){
  const course = tableData.dataSource.find<Course>(item => item.id == id);
  if (!course){
    message.error("未找到改项");
  }
  modalData.data = course;
  modalData.modalStatus = true;
}

function moreCourse(id: number){
  router.push("/administrator/chapter/" + id);
}

function addCourse(){
  modalData.data = undefined;
  modalData.modalStatus = true;
}

function modalCancel(){
  modalData.modalStatus = false;
}

function modalOk(){
  modalData.modalStatus = false;
  loadData();
}


</script>

<style scoped>

</style>