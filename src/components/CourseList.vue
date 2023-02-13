<script setup lang="ts">
    import { ref } from "vue";
    import { Course } from "@/models/Course";
    import CourseItem from "./CourseItem.vue";
    const courseList = ref<Array<Course>>(new Array<Course>());
    // for(let index of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]){
    //     courseList.value.push(new CourseDto(<string><unknown>index, "测试" + index, "描述" + index));
    // }
    
</script>

<template>
    <div class="course-list">
        <template class="course-item" v-for="course in courseList" :key="course.id">
            <CourseItem :course-name="course.name" :course-desc="course.desc" />
        </template>
    </div>
</template>

<style scoped>
.course-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: space-between;
  gap: 1rem;

  /* margin: -2rem 0 0 -2rem; */
}

/* .course-item {
    margin: 2rem 0 0 2rem;
} */
</style>