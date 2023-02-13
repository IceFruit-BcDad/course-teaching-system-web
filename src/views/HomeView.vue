<script setup lang="ts">
import VerticalClassificationMenuVue from '@/components/VerticalClassificationMenu.vue';
import Carousel from "@/components/Carousel.vue";
import {RightCircleOutlined, LeftCircleOutlined} from "@ant-design/icons-vue";
import {ref, watch} from "vue";
import {Course} from "@/models/Course";
import {useAxios} from "@vueuse/integrations/useAxios";
import {ListResponse} from "@/api/Response";
import {Api} from "@/api";

const courseList = ref<Course[]>();
function loadData(){
  const { data, isFinished } = useAxios<ListResponse<Course>>(Api.GetCourses(0, 10));
  watch(isFinished, () => {
    if(!data.value || !data.value.success){
      return
    }
    courseList.value = data.value?.data.list;
  });
}

loadData();

</script>

<template>
  <div class="container">
    <div class="c1">
      <VerticalClassificationMenuVue id="vcm" />
      <div class="carousel-p">
        <a-carousel arrows autoplay>
          <template #prevArrow>
            <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
              <left-circle-outlined />
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: 10px">
              <right-circle-outlined />
            </div>
          </template>
          <div><h3>1</h3></div>
          <div><h3>2</h3></div>
          <div><h3>3</h3></div>
          <div><h3>4</h3></div>
        </a-carousel>
      </div>
    </div>
    <div class="c2">
      <h2>推荐课程</h2>
      <div class="course-list">
        <template class="course-item" v-for="course in courseList" :key="course.id">
          <CourseItem :course-name="course.name" :course-desc="''" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

#vcm {
  height: 100%;
  width: 17%;
}
.c1 {
  display: flex;
  height: 360px;
}

.c2 {
  display: flex;
  margin-top: 30px;
  flex-direction: column;
}

/*#carousel {*/
/*  height: 360px;*/
/*  width: 400px;*/
/*}*/

.carousel-p {
  width: 83%;
  margin-left: 10px;
  border-radius: 0.4rem;
}

/* For demo */
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 360px;
  line-height: 360px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
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
</style>