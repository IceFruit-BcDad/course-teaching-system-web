<template>
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <Modal :show="show">
      <template #header>
        <h3>{{ isAdd ? "新增" : "编辑" }}用户</h3>
      </template>
      <template #body>
        <div class="content">
          <div class="content-item">
            <label class="content-item-label" for="name-input">用户姓名</label>
            <input id="name-input" v-model="formData.name"/>
          </div>
          <div class="content-item">
            <label class="content-item-label" for="phone-input">手机号</label>
            <input id="phone-input" v-model="formData.phoneNumber"/>
          </div>
          <div class="content-item">
            <label class="content-item-label" for="type-input">用户类型</label>
            <select id="type-input" v-model="formData.type">
              <option selected value="0">普通用户</option>
              <option value="100">开发组</option>
              <option value="200">管理员</option>
            </select>
          </div>
          <div class="content-item">
            <label class="content-item-label" for="pwd-input">密码</label>
            <input id="pwd-input" type="password" v-model="formData.password"/>
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
import {computed, reactive, ref, watch} from "vue";
import {useAxios} from "@vueuse/integrations/useAxios";
import {DataResponse, ListResponse} from "@/api/Response";
import {Api} from "@/api";
import axios from "axios";
import {CreateOrUpdateClassificationRequest} from "@/models/CreateOrUpdateClassificationRequest";
import {CreateOrUpdateUserRequest, User} from "@/models/User";
import {message} from "ant-design-vue";

const props = defineProps<{
  show: boolean,
  data?: User,
}>();

const emit = defineEmits<{
  (e: "ok"): void
  (e: "cancel"): void
}>()

interface FormData {
  name: string
  phoneNumber: string
  type: number
  password: string
}

const isAdd = computed<boolean>(() => {
  return props.data === undefined;
})

const formData: FormData = reactive({
  name: "",
  phoneNumber: "",
  type: 0,
  password: ""
})
watch(() => props.data, (user) => {
  formData.password = "";
  if (user){
    formData.name = user.name;
    formData.phoneNumber = user.phoneNumber;
    formData.type = user.type;
  } else {
    formData.name = "";
    formData.phoneNumber = "";
    formData.type = 0;
  }
});

function ok(){
  if (formData.name.length == 0){
    message.error("必须输入用户姓名！");
    return;
  }
  if (formData.phoneNumber.length != 11){
    message.error("必须输入争取的手机号！");
    return;
  }
  if (props.data === undefined){
    if (formData.password.length == 0){
      message.error("新建用户必须输入密码")
      return;
    }
    create();
  } else {
    update(props.data.id)
  }
}

function create(){
  const c = new CreateOrUpdateUserRequest(formData.type, formData.phoneNumber, formData.name)
  c.password = formData.password;
  const { data, isFinished, error } = useAxios<DataResponse<User>>(Api.CreateUser, {
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
  const c = new CreateOrUpdateUserRequest(formData.type, formData.phoneNumber, formData.name)
  if (formData.password.length > 0){
    c.password = formData.password;
  }
  const { data, isFinished, error } = useAxios<DataResponse<User>>(Api.UpdateUser(id), {
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
  width: 70px;
  text-align: right;
}

.footer-content {
  display: flex;
  justify-content: end;
}
</style>