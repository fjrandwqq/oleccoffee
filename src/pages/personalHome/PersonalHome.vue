<!--
Description
@authors Your Name (you@example.org)
@date    2018-07-06 20:13:34
@version 1.0.0
-->
<style lang="less" scoped src="./PersonalHome.less"></style>
<template>
    <div id="personal">
        <view-box style="height:100%;" ref="viewBox">
            <!-- <x-header slot="header" :right-options="{showMore: true}" @on-click-more="showMenus = true">
                我的
            </x-header> -->
            <group class="clearfix">
                <div class="avator ml20">
                    <img src="../../images/home/Home.png">
                </div>
                <div class="text-info ml20">
                    <p>范炯荣</p>
                    <p>155****2614</p>
                </div>
            </group>
            <divider></divider>
            <cellBox is-link link="/orderList">我的订单</cellBox>
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

