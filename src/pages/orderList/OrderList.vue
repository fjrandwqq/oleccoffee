<!--
Description
@authors Your Name (you@example.org)
@date    2018-07-06 22:31:15
@version 1.0.0
-->
<template>
  <div id="order">
    <view-box style="height:100%;" ref="viewBox">
      <div class="ol-group" v-for="(item,index) in orderList" :key="index">
        <p class="goods ml15">{{item.name}} {{item.num}}杯</p>
        <p class="price ml15 mt10">￥{{item.price}}元</p>
        <p class="send-time ml15 mt20">配送时间{{item.time}}左右</p>
        <div class="state">{{item.state}}<img style="width:12px" src="../../images/arrow.png"></div>
      </div>

    </view-box>
  </div>
</template>


<script>
import { ViewBox, Group } from 'vux';
export default {
	components: {
		ViewBox,
		Group
	},
	data() {
		return {
			orderList: [
				{
					name: '美式咖啡',
					state: '未支付',
					time: '2018-09-20 12:36',
					price: 30,
					num: 3,
				},
				{
					name: '奇异果冰沙',
					state: '支付',
					time: '2018-09-20 12:36',
					price: 20,
					num: 2,
				},
			],
		};
	},
};
</script>

<style lang="less" scoped src="./OrderList.less"></style>
