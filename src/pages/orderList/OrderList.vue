<!--
Description
@authors Your Name (you@example.org)
@date    2018-07-06 22:31:15
@version 1.0.0
-->
<template>
	<div id="order" ref="orderList">
		<div class="order-list">
			<div class="ol-group" v-for="(item,index) in orderList" :key="index">
				<span>{{item.name}} {{item.num}}杯</span>
				<p>￥{{item.price}}元</p>
				<div class="delivery">
					<span class="time">配送时间：{{item.time}}</span>
					<span class="state">{{item.state}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import BScroll from "better-scroll"
export default {
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
					state: '已支付',
					time: '2018-09-20 12:36',
					price: 20,
					num: 2,
				},
			],
		};
	},
	mounted() {
		this.$nextTick(() => {
			new BScroll(this.$refs.orderList, {
				click: true,
				tap: true,
			})
		})
	},
	created() {

	}
};
</script>

<style lang="less" scoped src="./OrderList.less"></style>
