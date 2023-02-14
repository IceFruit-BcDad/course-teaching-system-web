<script setup lang="ts">
import {computed, reactive} from 'vue';
import {Course} from "@/models/Course";
import {useRouter} from "vue-router";

const props = defineProps<{
    data: Course
}>();

const router = useRouter();

const imageUrl = computed<string>(() => {
  if (props.data.coverUrl.length == 0){
    return "";
  }
  return import.meta.env.VITE_SERVICE_ADDRESS + "/files/" + props.data.coverUrl;
});
const courseItemStyle = reactive({
    isMouseEnter: false,
    margin: '1rem',
    width: '12rem',
    height: '12rem',
    cursor: 'default'
})
function courseMouseEnter(){
    courseItemStyle.isMouseEnter = true
    courseItemStyle.margin = '0rem'
    courseItemStyle.width = '14rem'
    courseItemStyle.height = '14rem'
    courseItemStyle.cursor = 'pointer'
}
function courseMouseLeave(){
    courseItemStyle.isMouseEnter = false
    courseItemStyle.margin = '1rem'
    courseItemStyle.width = '12rem'
    courseItemStyle.height = '12rem'
    courseItemStyle.cursor = 'default'
}

function enterCourse(){
  router.push("/course/" + props.data.id);
}
</script>

<template>
    <div class="course-item" @click="enterCourse" @mouseenter="courseMouseEnter" @mouseleave="courseMouseLeave">
        <div class="course-icon-container">
            <img class="course-icon" :src="imageUrl" alt="默认资源">
        </div>
        <div class="course-infomation-container">
            <div class="course-name">{{data.name}}</div>
            <div class="course-desc">{{data.createTime}}</div>
            <div v-show="courseItemStyle.isMouseEnter" class="course-more-desc">课程分类:{{data.classificationName}}</div>
        </div>
    </div>
</template>

<style scoped>
.course-item{
    /* margin: 1rem;
    width: 12rem;
    height: 12rem; */
    margin: v-bind('courseItemStyle.margin');
    width: v-bind('courseItemStyle.width');
    height: v-bind('courseItemStyle.height');
    cursor: v-bind('courseItemStyle.cursor');
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2), 0 0.5rem 1.2rem 0 rgba(0, 0, 0, 0.19);
}

/* .course-item:hover{
    margin: 0rem;
    width: 14rem;
    height: 14rem;
    cursor: pointer;
} */

.course-icon-container{
    height: 8rem;
    background: gray;
    border-radius: 0.5rem 0.5rem 0 0;
}

.course-icon{
    height: 100%;
    width: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
}

.course-infomation-container{
    padding: 0.4rem;
}

.course-name{
    color: #000;
}

.course-desc .course-more-desc{
    font-size: 0.8rem;
}

</style>