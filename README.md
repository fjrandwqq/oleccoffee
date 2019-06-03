# oleccoffee
咖啡公众号
 
# ✨ 技术栈
* vue 2
* vux
* swiper 轮播组件

# 🔨快速开始

1. npm install

2. 注释以下代吗，跳过微信认证模块

* main.js
```
// setWechatConfig({
//         url: url,
//     })
//     .then(res => {
//         console.log('setWechatConfig');
//         Vue.wechat.config({
//             // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//             appId: res.appId, // 必填，公众号的唯一标识
//             timestamp: res.timestamp, // 必填，生成签名的时间戳
//             nonceStr: res.nonceStr, // 必填，生成签名的随机串
//             signature: res.signature, // 必填，签名
//             jsApiList: ['getLocation','chooseWXPay'],
//         });
//     });
```
* App.vue
```

beforeCreate() {
	    // let code;
		// if (window.location.href.indexOf('code') === -1) {
		// 	// let appid = 'wxb9748203f5c07c9b';
		// 	let appid = 'wxac6caf7d4e6a7d97';
		// 	let redirectUrl = encodeURIComponent(window.location.href);
		// 	window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
		// 	return;
		// }
		// code = window.location.href.split('code=')[1].split('&')[0];
		// getOpenId(code).then(res => {
		// 	this.$store.commit('setOpenId', res);
		// });
	 },
};

```
* homePage.vue

```
  	created() { },
		mounted() {
			// this.$nextTick(() => {
			// 	new BScroll('.category-wrapper', scrollOption);
			// 	this.productScroll = new BScroll('.product-wrapper', scrollOption);
			// });
			this.loading = true;
			// this.getLocation();

			//本地测试使用，打包注释下面
			this.getShop(113, 23);
		}

```

3. cnpm start

4. 浏览器打开







