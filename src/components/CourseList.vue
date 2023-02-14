<script setup lang="ts">
import {ref, watch} from "vue";
import { Course } from "@/models/Course";
import CourseItem from "./CourseItem.vue";
import {useAxios} from "@vueuse/integrations/useAxios";
import {ListResponse} from "@/api/Response";
import {Api} from "@/api";
import {useRoute} from "vue-router";

const limit = 30;
const courseList = ref<Course[]>();
const current = ref<number>(1);
const total = ref<number>(0);
const route = useRoute();
function loadData(offset: number = 0){
  const classificationId = route.query.classificationId;
  const { data, isFinished } = useAxios<ListResponse<Course>>(Api.GetCourses(offset, limit, classificationId));
  watch(isFinished, () => {
    if(!data.value || !data.value.success){
      return
    }
    courseList.value = data.value?.data.list;
    total.value = data.value?.data.total;
  });
}

loadData();

</script>

<template>
  <div id="content">
    <div class="course-list">
      <template class="course-item" v-for="course in courseList" :key="course.id">
        <CourseItem :data="course" />
      </template>
    </div>
    <a-pagination id="list-pagination" v-model:current="current" :total="total" :defaultPageSize="limit" show-less-items />
  </div>

</template>

<style scoped>
#content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
#list-pagination {
  text-align: right;
  margin-top: 20px;
}
.course-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: space-between;
  gap: 1rem;
  flex-grow: 1;

  /* margin: -2rem 0 0 -2rem; */
}

/* .course-item {
    margin: 2rem 0 0 2rem;
} */
</style>