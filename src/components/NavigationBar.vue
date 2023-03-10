<script setup lang="ts">

import {reactive, Ref, ref, toRef, watch, watchEffect} from "vue";
import CtsButton from "@/components/CtsButton.vue";
import {useCookies} from "@vueuse/integrations/useCookies";
import {useUserStore} from "@/stores/user";
import LoginModal from "@/components/LoginModal.vue";
import {useAxios} from "@vueuse/integrations/useAxios";
import {DataResponse, Response} from "@/api/Response";
import {User} from "@/models/User";
import {Api} from "@/api";
import {useRouter} from "vue-router";

interface Bar {
  homeTriggerStatus: boolean
  courseTriggerStatus: boolean
  aboutTriggerStatus: boolean
  adminTriggerStatus: boolean
}

const bar: Bar = reactive({
  homeTriggerStatus: false,
  courseTriggerStatus: false,
  aboutTriggerStatus: false,
  adminTriggerStatus: false
})

function liMouseEnter(triggerStatus: Ref<boolean>){
  triggerStatus.value = true
}
function liMouseLeave(triggerStatus: Ref<boolean>){
  triggerStatus.value = false
}

const userStore = useUserStore();
const userId = ref();
const router = useRouter();
const cookies = useCookies();
const isSupportUser = ref<boolean>(false);
const isAdminUser = ref<boolean>(false);


function loadLoginInfo(){
  userId.value = cookies.get("icefruit-current-user-id");
  if (userId.value){
    loadUserInfo(userId.value);
  }
}

loadLoginInfo();

function loadUserInfo(userId: any){
  const { data, isFinished, error } = useAxios<DataResponse<User>>(Api.GetUserInfo(userId));
  watch(isFinished, () => {
    if (error.value){
      alert(error.value);
      return;
    }
    if (!data.value?.success){
      alert(data.value?.message ?? "用户未登录");
      return;
    }
    userStore.setUser(data.value?.data)
    isAdminUser.value = data.value?.data.type == 200;
    isSupportUser.value = data.value?.data.type == 100;
  })
}


const loginModalStatus = ref<boolean>(false);
function login(){
  loginModalStatus.value = true;
}

function loginCancel(){
  loginModalStatus.value = false;
}

function loginOk(){
  loginModalStatus.value = false;
  loadLoginInfo();
}

function logout(){
  const { data, isFinished, error } = useAxios<Response>(Api.Logout);
  watch(isFinished, () => {
    if (error.value){
      alert(error.value);
      return;
    }
    if (!data.value?.success){
      alert(data.value?.message ?? "数据异常");
      return;
    }
    isSupportUser.value = false;
    isAdminUser.value = false;
    userStore.setUser(undefined);
    router.replace("/");
  })
}
</script>

<template>
  <div id="header-container">
    <nav id="nav-header">
      <ul class="ul-g">
        <li class="li-item" @mouseenter="liMouseEnter(toRef(bar, 'homeTriggerStatus'))" @mouseleave="liMouseLeave(toRef(bar, 'homeTriggerStatus'))">
          <RouterLink to="/home">主页</RouterLink>
          <div v-show="bar.homeTriggerStatus" class="b-line"></div>
        </li>
        <li class="li-item" @mouseenter="liMouseEnter(toRef(bar, 'courseTriggerStatus'))" @mouseleave="liMouseLeave(toRef(bar, 'courseTriggerStatus'))">
          <RouterLink to="/courses">课程</RouterLink>
          <div v-show="bar.courseTriggerStatus" class="b-line"></div>
        </li>
<!--        <li class="li-item" @mouseenter="liMouseEnter(toRef(bar, 'aboutTriggerStatus'))" @mouseleave="liMouseLeave(toRef(bar, 'aboutTriggerStatus'))">-->
<!--          <RouterLink to="/about">关于</RouterLink>-->
<!--          <div v-show="bar.aboutTriggerStatus" class="b-line"></div>-->
<!--        </li>-->
        <li v-show="isAdminUser || isSupportUser" class="li-item" @mouseenter="liMouseEnter(toRef(bar, 'adminTriggerStatus'))" @mouseleave="liMouseLeave(toRef(bar, 'adminTriggerStatus'))">
          <RouterLink to="/administrator" id="admin-link">管理<img id="admin-icon" src="../assets/arrow_down.png" alt="默认资源"></RouterLink>
          <div v-show="bar.adminTriggerStatus" class="admin-panel">
            <ul class="ul-g admin-nav">
              <li v-show="isAdminUser" class="li-admin"><RouterLink class="admin-link" to="/administrator/classification">分类</RouterLink></li>
              <li v-show="isSupportUser" class="li-admin"><RouterLink class="admin-link" to="/administrator/course">课程</RouterLink></li>
<!--              <li class="li-admin"><RouterLink class="admin-link" to="/administrator/chapter">章节</RouterLink></li>-->
              <li v-show="isAdminUser" class="li-admin"><RouterLink class="admin-link" to="/administrator/user">用户</RouterLink></li>
            </ul>
          </div>
          <div v-show="bar.adminTriggerStatus" class="b-s-line"></div>
        </li>
      </ul>
      <div id="nav-user-body">
        <div id="nav-login-btn" v-show="userStore.user === undefined" @click="login">登录</div>
        <div v-show="userStore.user !== undefined">{{ userStore.user?.name }}</div>
        <div id="nav-logout-btn" v-show="userStore.user !== undefined" @click="logout">注销</div>
      </div>
    </nav>

    <LoginModal :show="loginModalStatus" @cancel="loginCancel" @ok="loginOk"/>
  </div>
</template>

<style scoped>
ol, ul, dl {
  margin: 0;
}
#header-container {
  background-color: var(--vt-c-main);
}
#nav-header {
  display: flex;
  width: 1200px;
  height: 100%;
  margin: auto;
  align-items: center;
}
.ul-g {
  display: flex;
  padding-inline-start: 0px;
}
.ul-g > li {
  list-style-type: none;
  padding: 1rem;
  color: white;
}
.li-item > a {
  text-decoration: none;
  color: white;
}

#admin-link {
  display: flex;
  align-items: center;
}

#admin-icon {
  margin: 0 0.5rem;
  width: 1rem;
  height: 1rem;
}

.admin-panel {
  position: absolute;
  width: 5rem;
  background-color: var(--vt-c-white-mute);
  color: black;
  /*padding: 1rem;*/
  margin: 1rem 0rem 0 -0.5rem;
  border-radius: 0.2rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.b-line {
  background: white;
  height: 0.05rem;
  width: 3rem;
  position: absolute;
  margin: 0.8rem 0 0 -0.5rem;
}

.b-s-line {
  background: white;
  height: 0.05rem;
  width: 5rem;
  position: absolute;
  margin: 0.8rem 0 0 -0.5rem;
}

.admin-nav {
  flex-direction: column;
}

.admin-nav > li {
  padding: 0;
}

.li-admin {
  cursor: pointer;
}

.li-admin > a {
  text-decoration: none;
  color: black;
}

.li-admin:hover{
  color: white;
  background-color: var(--vt-c-main);
}

.admin-link {
  display: block;
  height: 100%;
  width: 100%;
  padding: 0.4rem;
}

#nav-user-body {
  flex-grow: 1;
  display: flex;
  justify-content: end;
  color: white;
}

#nav-user-body > div {
  cursor: pointer;
  margin-right: 8px;
}

</style>
