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
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <a>Delete</a>
        </template>
      </template>
      <!--    <template #expandedRowRender="{ record }">-->
      <!--      <a-table style="margin: 0" :columns="chapterColumns" :data-source="record.chapters"  :scroll="{ x: 2000 }"></a-table>-->
      <!--&lt;!&ndash;      <p style="margin: 0">&ndash;&gt;-->
      <!--&lt;!&ndash;        {{ record.description }}&ndash;&gt;-->
      <!--&lt;!&ndash;      </p>&ndash;&gt;-->
      <!--    </template>-->
    </a-table>

    <CourseManagerModal :show="modalData.modalStatus" />
  </div>
</template>

<script setup lang="ts">
import {useAxios} from "@vueuse/integrations/useAxios";
import {DtoList, ListResponse} from "@/api/Response";
import {Api} from "@/api";
import {computed, reactive, watch} from "vue";
import {Course} from "@/models/Course";
import type {TableProps} from "ant-design-vue";
import CtsButton from "@/components/CtsButton.vue";
import CourseManagerModal from "@/components/CourseManagerModal.vue";

interface Modal {
  modalStatus: boolean,
  data?: Course,
  classificationId?: number
}

interface TableData {
  dataSource: Course[];
  limit: number;
  offset: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
}

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
  pageSize: tableData.totalPages,
}));

function handleTableChange(pag: any){
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
  });
}

loadData();

function addCourse(){
  modalData.modalStatus = true;
}

</script>

<style scoped>

</style>