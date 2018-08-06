<!--
Description
@authors Your Name (you@example.org)
@date    2018-07-06 20:13:34
@version 1.0.0
-->
<style lang="less" scoped src="./PersonalHome.less"></style>
<template>
	<div id="personal">
		<div class="person-info-wrapper clearfix">
			<div class="person-info-real">
				<img class="avator" :src="headImgUrl">
				<div class="text-info">
					<p class="nickname">{{nickname}}</p>
					<!-- <p class="phone">{{phone}}</p> -->
				</div>
			</div>
		</div>
		<cell-box is-link link="/orderList">
			<img src="@/images/order.png" />
			<span>我的订单</span>
		</cell-box>
	</div>
</template>
<script>
import { getUserInfo } from '@/services/getData';
export default {
	data() {
		return {
			nickname: '',
			phone: '155****2614',
			headImgUrl: '',
		};
	},
	mounted() {
		this.getUserInfo();
	},
	actived() {
		this.getUserInfo();
	},
	methods: {
		getUserInfo() {
			let userInfo = this.$store.state.userInfo;
			if (userInfo) {
				this.nickname = userInfo.nickname;
				this.headImgUrl = userInfo.headImgUrl;
			} else {
				let openId = this.$store.state.openId;
				if (openId) {
					getUserInfo({ openId }).then(res => {
						const { headImgUrl, nickname } = res || {};
						this.headImgUrl = headImgUrl;
						this.nickname = nickname;
						this.$store.commit('setUserInfo', { headImgUrl, nickname });
					});
				}
			}
		},
	},
};
</script>


