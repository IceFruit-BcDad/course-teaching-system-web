<template>
  <div>
    <div style="margin-bottom: 16px">
      <CtsButton @click="add">新增用户</CtsButton>
    </div>

    <a-table :columns="columns"
             :data-source="tableData.dataSource"
             :pagination="pagination"
             :loading="tableData.isLoading"
             @change="handleTableChange"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'action'">
          <a @click="more(record.id)">详情</a>
          <a @click="edit(record.id)" style="margin-left: 10px;">编辑</a>
          <a-popconfirm title="确定要删除该用户吗?"
                        ok-text="确定" cancel-text="取消"
                        @confirm="deleteUser(record.id)">
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

    <UserManagerModal :show="modalData.modalStatus" :data="modalData.data" @cancel="modalCancel" @ok="modalOk"/>
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
import {User} from "@/models/User";
import UserManagerModal from "@/components/UserManagerModal.vue";

interface Modal {
  modalStatus: boolean,
  data?: User
}

interface TableData {
  dataSource: User[];
  limit: number;
  offset: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
}

const router = useRouter();

const modalData: Modal = reactive({ modalStatus: false});

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: "25%", fixed: false },
  { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber', width: "25%" },
  { title: '用户类型', dataIndex: 'typeName', key: 'typeName', width: "25%" },
  { title: '操作', key: 'action', width: "25%" },
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
  const { data, isFinished } = useAxios<ListResponse<User>>(Api.GetUsers(offset, tableData.limit));
  watch(isFinished, () => {
    if(!data.value || !data.value.success){
      return
    }
    tableData.dataSource = data.value.data.list;
    tableData.dataSource.forEach(item => item.typeName = getTypeName(item.type))
    tableData.offset = data.value?.data.offset;
    tableData.total = data.value?.data.total;
    tableData.totalPages = data.value?.data.totalPages;
    console.log(tableData);
  });
}

function getTypeName(type: number): string{
  if (type == 100){
    return "开发组";
  } else if (type == 200){
    return "管理员";
  } else {
    return "用户";
  }
}

loadData();

function deleteUser(id: number){
  const { data, isFinished, error } = useAxios<Response>(Api.DeleteUser(id), {
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

function edit(id: number){
  const user = tableData.dataSource.find<User>(item => item.id == id);
  if (!user){
    message.error("未找到改项");
  }
  modalData.data = user;
  modalData.modalStatus = true;
}

function more(id: number){
  // router.push("/administrator/chapter/" + id);
}

function add(){
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