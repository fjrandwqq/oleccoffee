<style scoped lang="less" src="./Home.less"></style>
<template>
  <div id="home">
    <div class="view-wrapper">
      <router-view></router-view>
    </div>
    <tabbar>
      <tabbar-item>
        <!-- <img slot="icon" src="../assets/demo/icon_nav_button.png"> -->
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item show-dot>
        <!-- <img slot="icon" src="../assets/demo/icon_nav_msg.png"> -->
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem } from "vux";
export default {
  components: {
    Tabbar,
    TabbarItem
  },
  data() {
    return {};
  },
  watch: {},
  methods: {},
  created() {}
};
</script>
