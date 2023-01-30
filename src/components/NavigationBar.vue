<script setup lang="ts"></script>

<template>
  <div id="header-container">
    <nav id="nav-header">
      <ul id="ul-header">
        <li><RouterLink to="/home">主页</RouterLink></li>
        <li><RouterLink to="/course">课程</RouterLink></li>
        <li><a href="#">关于</a></li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
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
#ul-header {
  display: flex;
  padding-inline-start: 0px;
}
#ul-header > li {
  list-style-type: none;
  padding: 1rem;
  color: white;
}
#ul-header > li > a {
  text-decoration: none;
  color: white;
}
</style>
