<template>
  <div class="search">
    <el-input
      v-model="searchV"
      style="width: 240px"
      placeholder="搜索路由"
      @keyup.enter.native="doSearch()"
    >
      <template #prefix>
        <el-icon class="el-input__icon">
          <search />
        </el-icon>
      </template>
    </el-input>
  </div>
  <div>
    <el-button type="primary" v-for="item in linkItem" @click="clickLink(item)">
      {{ item.path }}</el-button
    >
  </div>
</template>
<script setup>
import { router } from "@/router/index";
import { onMounted, ref } from "vue";
import { Calendar, Search } from "@element-plus/icons-vue";
const linkItem = ref([]);
const searchV = ref("");
const filterLink = (item) => {
  linkItem.value = [];
  const routes = router.getRoutes();
  for (var index in routes) {
    const item = routes[index];
    if (item.path.indexOf(searchV.value) > -1) {
      linkItem.value.push(item);
    }
  }
};
onMounted(() => {
  // const routes = router.getRoutes()
  // for (var item in routes) {
  //     linkItem.value.push(routes[item])
  // }
  filterLink();
});
const clickLink = (item) => {
  console.log(item);
  router.push({
    path: item.path,
  });
};
const doSearch = () => {
  // console.log(searchV.value)
  filterLink();
};
</script>
<style scoped>
.search {
  margin: auto;
  width: 50%;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
