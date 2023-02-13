<template>
  <div>
    <div style="margin-bottom: 16px">
      <CtsButton @click="addChapter">新增章节</CtsButton>
    </div>
    <a-table :columns="columns" :data-source="tableData.dataSource" :scroll="{ x: 2000 }">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <a>Delete</a>
        </template>
      </template>
      <!--    <template #expandedRowRender="{ record }">-->
      <!--      <p style="margin: 0">-->
      <!--        {{ record.description }}-->
      <!--      </p>-->
      <!--    </template>-->
    </a-table>
  </div>
</template>
<script setup lang="ts">
import {Chapter} from "@/models/Chapter";
import {computed, reactive, watch} from "vue";
import {useAxios} from "@vueuse/integrations/useAxios";
import {ListResponse} from "@/api/Response";
import {Course} from "@/models/Course";
import {Api} from "@/api";

const props = defineProps<{
  id: string
}>();

const columns = [
  { title: '章节名称', dataIndex: 'title', key: 'title', width: "30%", fixed: true },
  { title: '修改时间', dataIndex: 'lastModifyTime', width: "30%", key: 'lastModifyTime' },
  { title: '操作', width: "30%", key: 'action' },
];

interface TableData {
  dataSource: Chapter[];
  isLoading: boolean;
}

const tableData: TableData = reactive({
  dataSource: [],
  isLoading: false
})

// const pagination = computed(() => ({
//   total: tableData.total,
//   current: tableData.offset / tableData.limit + 1,
//   pageSize: tableData.limit,
// }));

function loadData(courseId: string){
  const { data, isFinished } = useAxios<ListResponse<Chapter>>(Api.GetChapters(courseId));
  watch(isFinished, () => {
    if(!data.value || !data.value.success){
      return
    }
    tableData.dataSource = data.value.data.list;
    console.log(tableData);
  });
}

loadData(props.id);


function addChapter(){

}

</script>

