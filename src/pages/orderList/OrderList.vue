<!--
Description
@authors Your goodsName (you@example.org)
@date    2018-07-06 22:31:15
@version 1.0.0
-->
<template>
	<div id="order">
		<div class="order-list">
			<scroller lock-x height="100%" @on-pullup-loading="getOrderList" :upConfig="upConfig">
				<div class="ol-group" v-for="(item,index) in orderList" :key="index">
					<span>{{item.goodsName}} {{item.num}}杯</span>
					<p>￥{{item.price}}元</p>
					<div class="delivery">
						<span class="receiveDateTime">配送时间：{{item.receiveDateTime}}</span>
						<span class="status">{{item.status}}</span>
					</div>
				</div>
			</scroller>
		</div>
	</div>
</template>
<script>
import BScroll from 'better-scroll';
import { Scroller } from 'vux';
import { getOrderList } from '@/services/getData';
export default {
	components: {
		Scroller,
	},
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
			upConfig: {
				content: '上拉加载更多',
				downContent: '上拉加载更多',
				upContent: '上拉加载更多',
				loadingContent: '加载完成',
			},
		};
	},
	mounted() {
		this.$nextTick(() => {
			new BScroll('#order');
		});
		this.getOrderList();
	},
	methods: {
		getOrderList() {
			getOrderList(this.page).then(res => {
				this.orderList.splice(this.orderList.length, 0, res);
				this.page.start += 10;
			});
		},
	},
};
</script>

<style lang="less" scoped src="./OrderList.less"></style>
