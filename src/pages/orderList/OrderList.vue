<!--
Description
@authors Your goodsName (you@example.org)
@date    2018-07-06 22:31:15
@version 1.0.0
-->
<template>
	<div id="order">
		<div class="order-list">
			<div class="ol-group" v-for="(item,index) in orderList" :key="index">
				<span>{{item.goodsName}} {{item.num}}杯</span>
				<p>￥{{item.price}}元</p>
				<div class="delivery">
					<span class="receiveDateTime">配送时间：{{item.receiveDateTime}}</span>
					<span class="status">{{item.status}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import BScroll from 'better-scroll';
import { getOrderList } from '@/services/getData';
const options = {
	pullUpLoad: {
		threshold: -20,
	},
	click: true,
	tap: true,
};
export default {
	data() {
		return {
			page: {
				start: 0,
				length: 10,
			},
			orderList: [
				{
					goodsName: '美式咖啡',
					status: '未支付',
					receiveDateTime: '2018-09-20 12:36',
					price: 30,
					num: 3,
				},
				{
					goodsName: '奇异果冰沙',
					status: '已支付',
					receiveDateTime: '2018-09-20 12:36',
					price: 20,
					num: 2,
				},
			],
			scroll: null,
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.scroll = new BScroll('#order', options);
			this.scroll.on('pullingUp', () => {
				this.getOrderList();
			});
		});
		this.getOrderList();
	},
	methods: {
		getOrderList() {
			let code = this.$store.state.code;
			if (code) {
				let params = {};
				params = Object.assign(this.page, { code: code });
				getOrderList(params).then(res => {
					this.orderList.splice(this.orderList.length, 0, res);
					this.page.start += 10;
				});
			}
		},
	},
};
</script>

<style lang="less" scoped src="./OrderList.less"></style>
