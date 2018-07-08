<!--
Description
@authors Your Name (you@example.org)
@date    2018-07-06 22:31:15
@version 1.0.0
-->
<template>
    <div id="order">
        <view-box style="height:100%;" ref="viewBox">
            <x-header slot="header" :right-options="{showMore: true}" @on-click-more="showMenus = true">
                我的订单
            </x-header>
            <router-view></router-view>
                <group class="ol-group" v-for="(item,index) in orderList" :key="index">
                    <div class="row">
                        <div class="name pl20">{{item.name}}</div>
                        <div class="state">{{item.state}}</div>
                    </div>
                    <div class="send-time pl20">配送时间{{item.time}}左右</div>
                </group>
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
  },
  data() {
    return {
      orderList: [
        {
          name: "11111111111",
          state: "未支付",
          time: "2018-09-20"
        },
        {
          name: "222",
          state: "支付",
          time: "2018-09-20"
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped src="./OrderList.less"></style>
