<style scoped lang="less" src="./Home.less"></style>
<template>
  <div id="home">
    <div class="view-wrapper">
      <transition :name="transitionName">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
    <tabbar>
      <tabbar-item :selected="tabIndex==index" v-model="tabIndex" @on-item-click="directTo(tab.link)" v-for="(tab,index) in tabList" :key="index">
        <img slot="icon" :src="tab.icon">
        <img slot="icon-active" :src="tab.iconActive">
        <span slot="label">{{tab.label}}</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
import coffeeSrc from "@/images/coffee.png";
import coffeeActiveSrc from "@/images/coffee-active.png";
import personSrc from "@/images/person.png";
import personActiveSrc from "@/images/person-active.png";
import { Tabbar, TabbarItem } from "vux";
export default {
  components: {
    Tabbar,
    TabbarItem
  },
  data() {
    return {
      transitionName: "swipe-left",
      tabIndex: 0,
      tabList: [
        {
          link: "/homePage",
          label: "首页",
          icon: coffeeSrc,
          iconActive: coffeeActiveSrc
        },
        {
          link: "/personalHome",
          label: "我的",
          icon: personSrc,
          iconActive: personActiveSrc
        }
      ]
    };
  },
  watch: {
    $route(to, from) {
      const isPersonalHome=to.name == 'personalHome';
      this.transitionName =isPersonalHome ? "swipe-left" : "swipe-right";
      this.tabIndex =+isPersonalHome;
    }
  },
  methods: {
    directTo(link) {
      this.$router.push(link);
    }
  },
  created() {}
};
</script>
