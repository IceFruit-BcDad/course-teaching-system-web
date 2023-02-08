<script setup lang="ts">
import { reactive } from 'vue';

defineProps<{
    courseName: string;
    courseDesc: string
}>()
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
</script>

<template>
    <div class="course-item" @mouseenter="courseMouseEnter" @mouseleave="courseMouseLeave">
        <div class="course-icon-container">
            <img class="course-icon" src="../assets/park.png" alt="默认资源">
        </div>
        <div class="course-infomation-container">
            <div class="course-name">{{courseName}}</div>
            <div class="course-desc">{{courseDesc}}</div>
            <div v-show="courseItemStyle.isMouseEnter" class="course-more-desc">更多描述:{{courseName}}</div>
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