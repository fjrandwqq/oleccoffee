<!--
Description
@authors Your Name (you@example.org)
@date    2018-07-06 20:13:34
@version 1.0.0
-->
<template>
    <div id="personal">
        <view-box style="height:100%;" ref="viewBox">
            <x-header slot="header" :right-options="{showMore: true}" @on-click-more="showMenus = true">
                我的
            </x-header>
            <router-view></router-view>
            <group class="clearfix">
                <div class="avator ml20">
                    <img src="../../../images/home/Home.png">
                </div>
                <div class="text-info ml20">
                    <p>范炯荣</p>
                    <p>155****2614</p>
                </div>
            </group>
            <divider></divider>
            <cellBox is-link link="/personal/order">我的订单</cellBox>
            <tabbar slot="bottom">
                <tabbar>
                    <tabbar-item>
                        <img class="tab-icon" slot="icon" src="../../../images/home/Home.png">
                        <span slot="label">首页</span>
                    </tabbar-item>
                    <tabbar-item>
                        <!-- <router-link :to="{path:'/personal/order'}"> -->
                        <img class="tab-icon" slot="icon" src="../../../images/personal/person.png">
                        <span slot="label">个人中心</span>
                        <!-- </router-link> -->
                    </tabbar-item>

                </tabbar>
            </tabbar>
        </view-box>
    </div>
</template>


<script>
import {
  ViewBox,
  XHeader,
  Group,
  Cell,
  CellBox,
  Tabbar,
  TabbarItem,
  Divider
} from "vux";
export default {
  components: {
    ViewBox,
    XHeader,
    Group,
    Cell,
    CellBox,
    Tabbar,
    TabbarItem,
    Divider
  }
};
</script>

<style lang="less" scoped>
@import "./PersonalHome.less";
</style>
