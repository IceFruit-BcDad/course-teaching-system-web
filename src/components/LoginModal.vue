<template>
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <Modal :show="show">
      <template #header>
        <h3>用户登录</h3>
      </template>
      <template #body>
        <div class="content">
          <div class="content-item">
            <label class="content-item-label" for="level-input">手机号</label>
            <input id="level-input" v-model="loginInfo.phoneNumber"/>
          </div>
          <div class="content-item">
            <label class="content-item-label" for="name-input">密码</label>
            <input id="name-input" type="password" v-model="loginInfo.password"/>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="footer-content">
          <CtsButton @click="login" :disabled="!isCanLogin">登录</CtsButton>
          <CtsButton @click="$emit('cancel')">取消</CtsButton>
        </div>
      </template>
    </Modal>
  </Teleport>
</template>

<script setup lang="ts">
import Modal from "@/components/Modal.vue";
import {computed, reactive, watch} from "vue";
import {VerifyPasswordRequest} from "@/models/VerifyPasswordRequest";
import {useAxios} from "@vueuse/integrations/useAxios";
import {DataResponse} from "@/api/Response";
import {Classification} from "@/models/Classification";
import {Api} from "@/api";
import CtsButton from "@/components/CtsButton.vue";
import {useUserStore} from "@/stores/user";
import {User} from "@/models/User";

interface LoginInfo{
  phoneNumber: string;
  password: string;
}

const props = defineProps<{
  show: boolean,
}>();

const emit = defineEmits<{
  (e: "ok"): void
  (e: "cancel"): void
}>()

const loginInfo: LoginInfo = reactive({
  phoneNumber: "",
  password: ""
})

const isCanLogin =  computed<boolean>(() => {
  return loginInfo.password.length > 0 && loginInfo.phoneNumber.length > 0;
});

function login(){
  const request = new VerifyPasswordRequest(loginInfo.phoneNumber, loginInfo.password);
  const { data, isFinished, error } = useAxios<DataResponse<User>>(Api.Login, {
    method: "post",
    data: request
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
    useUserStore().setUser(data.value?.data)
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
  line-height: 1.5715;
  margin-bottom: 10px;
  display: flex;
}

.content-item-label {
  display: inline-block;
  text-align: right;
  width: 60px;
  margin-right: 10px;
}

.footer-content {
  display: flex;
  justify-content: end;
}
</style>