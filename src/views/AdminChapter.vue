<template>
  <div>
    <div style="margin-bottom: 16px">
      <CtsButton @click="addChapter">新增章节</CtsButton>
    </div>
    <a-table :columns="columns"
             :data-source="tableData.dataSource"
             :pagination="false"
             :row-key="(record) => record.id"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'action'">
          <a @click="addChildChapter(record.id)">新增子章节</a>
          <a style="margin-left: 10px;" @click="editChapter(record.id)">编辑</a>
          <a-popconfirm title="确定要删除该章节吗?包含的章节也将一起彻底删除！"
                        ok-text="确定" cancel-text="取消"
                        @confirm="deleteChapter(record.id)">
            <a style="margin-left: 10px;">删除</a>
          </a-popconfirm>
        </template>
      </template>
<!--      <template #expandedRowRender="{ record }">-->
<!--        <div v-if="isHaveChildren(record)">-->
<!--          <a-list item-layout="horizontal" :data-source="record.children">-->
<!--            <template #renderItem="{ item }">-->
<!--              <a-list-item>-->
<!--                <template #actions>-->
<!--                  <a key="list-loadmore-edit">编辑</a>-->
<!--                  <a key="list-loadmore-delete">删除</a>-->
<!--                </template>-->
<!--                <a-list-item-meta-->
<!--                    :description="'修改时间:' + item.lastModifyTime"-->
<!--                >-->
<!--                  <template #title>-->
<!--                    <div>{{ item.title }}</div>-->
<!--                  </template>-->
<!--                </a-list-item-meta>-->
<!--              </a-list-item>-->
<!--            </template>-->
<!--          </a-list>-->
<!--        </div>-->

<!--      </template>-->
    </a-table>
    <ChapterManagerModal :show="modalData.modalStatus"
                         :data="modalData.data"
                         :course-id="modalData.courseId"
                         :parent-id="modalData.parentId"
                         @cancel="modalCancel"
                         @ok="modalOk"
    />
  </div>
</template>
<script setup lang="ts">
import {Chapter} from "@/models/Chapter";
import {computed, reactive, watch} from "vue";
import {useAxios} from "@vueuse/integrations/useAxios";
import { Response, DataResponse, ListResponse} from "@/api/Response";
import {Course} from "@/models/Course";
import {Api} from "@/api";
import ChapterManagerModal from "@/components/ChapterManagerModal.vue";
import {message} from "ant-design-vue";

const props = defineProps<{
  id: string
}>();

const columns = [
  { title: '章节名称', dataIndex: 'title', key: 'title', width: "30%", fixed: false },
  { title: '修改时间', dataIndex: 'lastModifyTime', width: "30%", key: 'lastModifyTime' },
  { title: '操作', width: "30%", key: 'action' },
];

interface TableData {
  dataSource: Chapter[];
  isLoading: boolean;
  expandedRowKeys: string[];
}

const tableData: TableData = reactive({
  dataSource: [],
  isLoading: false,
  expandedRowKeys: []
})

function expand(expanded: boolean, record: Chapter){
  console.log(expanded)
  console.log(record)
  tableData.expandedRowKeys = record.children?.map<string>(item => item.id.toString());
  console.log(tableData.expandedRowKeys);
}

// const pagination = computed(() => ({
//   total: tableData.total,
//   current: tableData.offset / tableData.limit + 1,
//   pageSize: tableData.limit,
// }));

interface Modal {
  modalStatus: boolean,
  data?: Chapter,
  courseId: number,
  parentId?: number
}

const modalData: Modal = reactive({ modalStatus: false, courseId: parseInt(props.id)});

function loadData(courseId: string){
  const { data, isFinished } = useAxios<ListResponse<Chapter>>(Api.GetChapters(parseInt(courseId)));
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
  modalData.data = undefined;
  modalData.parentId = undefined;
  modalData.modalStatus = true;
}

function modalCancel(){
  modalData.modalStatus = false;
}

function modalOk(){
  modalData.modalStatus = false;
  loadData(props.id);
}

function addChildChapter(id: number){
  modalData.data = undefined;
  modalData.parentId = id;
  modalData.modalStatus = true;
}

async function editChapter(id: number){
  const { data } = await useAxios<DataResponse<Chapter>>(Api.GetChapter(id));
  if(!data.value || !data.value.success){
    message.error("加载章节数据失败！");
    return
  }
  modalData.data = data.value?.data;
  modalData.parentId = data.value?.data.parentId;
  modalData.modalStatus = true;
}

async function deleteChapter(id: number){
  const { data } = await useAxios<Response>(Api.DeleteChapter(id),{
    method: "delete"
  });
  if(!data.value || !data.value.success){
    message.error("删除章节失败！");
    return
  }
  loadData(props.id);
}

function isHaveChildren(chapter: Chapter): boolean{
  const b = chapter.children != null && chapter.children.length > 0;
  return b;
}

</script>

