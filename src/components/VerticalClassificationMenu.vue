<template>
  <div class="container">
    <div class="menu-item" v-for="item in classificationArray">
      <a class="item-title" @click="clickMenu(item.id)">{{ item.name }}</a>
      <span class="item-child">
        <template v-for="(cItem, index) in item.children" :key="item">
          <a @click="clickMenu(cItem.id)">{{ cItem.name }}</a>
          <span v-if="index + 1 !== item.children?.length"> / </span>
        </template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useAxios} from '@vueuse/integrations/useAxios'
import {Api} from "@/api";
import {ListResponse} from "@/api/Response";
import {Classification} from "@/models/Classification";
import {AxiosResponse} from "axios";
import {useRouter} from "vue-router";

const router = useRouter();
const classificationArray = ref<Array<Classification>>()

const { data, isFinished } = useAxios<ListResponse<Classification>, AxiosResponse<ListResponse<Classification>>, any>(Api.GetClassifications);
watch(isFinished, () => {
  if(!data.value || !data.value.success){
    return
  }
  classificationArray.value = data.value.data.list;
});

function clickMenu(classificationId: number){
  router.push("/course?classificationId=" + classificationId)
}


</script>

<style scoped>
.container {
  width: 14rem;
  display: flex;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: .4rem;
  background-color: white;
  flex-direction: column;
}

.menu-item {
  padding: .2rem 1rem;
  overflow: hidden; /* 超出的文本隐藏 */
  text-overflow: ellipsis; /* 溢出用省略号 */
  white-space: nowrap;
}

.menu-item:hover {
  background-color: var(--color-block-light-hover);
  color: var(--color-text-hover);

  /* animation: a-text-color-hover 0.2s normal; */
}

@keyframes a-text-color-hover {
  from {
    color: black;
  }

  to {
    color: var(--color-text-hover);
  }
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.item-title {
  flex-shrink: 0;
}

.item-child {
  margin-left: .3rem;
  font-size: .85rem;
}

.item-child > a {
  color: inherit;
}
</style>