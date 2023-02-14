<template>
  <div>
    <v-md-preview id="md-view" :text="test"></v-md-preview>
<!--    <ChapterList class="chapter-list" v-if="courseId !== undefined" :course-id="courseId"/>-->
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useAxios} from "@vueuse/integrations/useAxios";
import {useRoute} from "vue-router";

const props = defineProps<{
  contentUrl: string
}>()
const route = useRoute();

const fileUrl = "/files/" + props.contentUrl + ".md";

const test =ref("# sad 123");

async function loadContent(){
  const {data} = await useAxios<any>(fileUrl);
  test.value = data.value;
  console.log(data)
}
loadContent();
</script>

<style scoped>
#md-view {
  /*margin-top: 20px;*/
  /*height: 900px;*/
  /*background: white;*/
}

.chapter-list {
  position: fixed;
  width: 200px;
  top: 100px;
  left: 100px;
  right: 0;
  z-index: 2;
}
</style>