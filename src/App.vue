<style lang="less" src="./style/custom.less"></style>
<template>
    <div id="app">
        <transition :name="transitionName">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>
<script>
import {getUserInfo } from '@/services/getData';
export default {
	name: 'app',
	data() {
		return {
			transitionName: 'swipe-left',
		};
	},
	watch: {
		$route(to, from) {
			const name = to.name;
			// if(name!='homePage' || name!="personalHome"){
			this.transitionName = `swipe-${name != this.$router.lastRouteName ? 'left' : 'right'}`;
			// }
			this.$router.lastRouteName = from.name;
		},
	},
	mounted() {
		this.$router.push('/');
	},
	beforeCreate() {
		if (window.location.href.indexOf('code') === -1) {
			let appid = 'wxb9748203f5c07c9b';
			let redirectUrl = encodeURIComponent(window.location.href);
			window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
		} else {
			let code = window.location.href.split('code=')[1].split('&')[0];
			console.log(code);
			getUserInfo({ code: code }).then(res => {
				console.log(res);
			});
		}
	},
};
</script>