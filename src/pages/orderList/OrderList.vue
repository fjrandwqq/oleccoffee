<!--
Description
@authors Your goodsName (you@example.org)
@date    2018-07-06 22:31:15
@version 1.0.0
-->
<template>
	<div id="order">
		<scroll ref="scroll" :pullUpLoad="pullUpLoad" :pullDownRefresh="pullDownRefresh" @pullingDown="refresh" :data="orderList" @pullingUp="getOrderList">
			<div class="order-list">
				<div class="ol-group" v-for="(item,index) in orderList" :key="index">
					<p v-for="(product,i) in item.orderGoodsList" :key="i">{{product.goodsName}} {{product.goodsNum}}杯</p>
					<p class="totalPrice">￥{{item.realTotalMoney}}元</p>
					<div class="delivery">
						<span v-if="item.deliveryDateTime" class="receiveDateTime">配送时间：{{item.deliveryDateTime}}</span>
						<span v-else class="receiveDateTime">下单时间：{{item.createDateTime}}</span>
						<span class="status">{{item.status}}</span>
					</div>
				</div>
			</div>
		</scroll>
	</div>
</template>
<script>
import BScroll from 'better-scroll';
import Scroll from "@/components/Scroll/Scroll";
import { getOrderList } from '@/services/getData';
export default {
	data() {
		return {
			pullDownRefresh: {
				threshold: 90,
				stop: 40
			},
			pullUpLoad: {
				threshold: 0
			},
			pageStart:0,
			pageSize:10,
			orderList: [],
		};
	},
	components: {
		Scroll
	},
	mounted() {
		this.getOrderList();
	},
	watch:{
		$route(val){
			this.pageStart=0;
			if(this.$route.path === '/orderList')
			this.getOrderList();
		}
	},
	methods: {
		refresh(){
			this.pageStart=0;
			this.getOrderList(true);
		},
		getOrderList(isRefresh) {
			let openId = this.$store.state.openId;
			if (openId) {
				getOrderList({
					start:this.pageStart,
					length:this.pageSize,
					openId
				}).then(res => {
					if(isRefresh){
						this.orderList=[];
					}
					if(res && res.length){
						this.orderList=this.orderList.concat(res);
						console.log(this.orderList);
						this.pageStart += this.pageSize;
						this.$refs.scroll.forceUpdate(true);
					}else{
						this.$refs.scroll.forceUpdate();
					}
				}).catch(err=>{
					this.$refs.scroll.forceUpdate(true);
				});
			}
		}
	},
};
</script>

<style lang="less" scoped src="./OrderList.less"></style>
