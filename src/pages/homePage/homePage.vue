<style lang="less" scoped src="./HomePage.less"></style>
<template>
	<div id="home-page">
		<div class="address">
			<div class="address-left" @click="showShopPopup">
				<img src="@/images/mark.png" height="18">
				<span>{{address}}</span>
				<x-icon type="ios-arrow-right" size="20"></x-icon>
			</div>
			<a class="phone" href="tel:13538809560">
				<img src="@/images/phone.png" height="20">
			</a>
		</div>
		<div class="content">
			<div class="swiper-wrapper">
				<!-- <swiper :options="swiperOption" ref="mySwiper">
					<swiper-slide v-for="(item,index) in bannerList" :key="index"><img :src="item.img" /></swiper-slide>
					<div class="swiper-pagination" slot="pagination"></div>
				</swiper> -->
				<Swiper class="swiper" v-if="bannerList.length > 0">
					<Slide v-for="(item,index) in bannerList" :key="index">
						<img :src="item.img" />
					</Slide>
				</Swiper>
			</div>
			<div class="shop-wrapper">
				<div class="category-wrapper">
					<div class="categories">
						<a :class="{active:currentIndex==index}" @click="selectCategory(index,$event)" v-for="(category,index) in goods" class="category needsclick" :key="index" ref="categoryList">
							{{category.name}}
						</a>
					</div>
				</div>
				<div class="product-wrapper">
					<div class="products">
						<div class="product-list" v-for="(category,index) in goods" :key="index" ref="productList">
							<p class="category-title">{{category.name}}</p>
							<div class="product" v-for="(product,index) in category.product" :key="index" @click="showProductModal(product.id)">
								<div class="product-img" :style="{background:'url('+product.showImg+') center no-repeat'}"></div>
								<div class="product-info">
									<span class="product-name">{{product.name}}</span>
									<p>
										<span class="product-price" v-show="product.realPrice">￥
											<i class="real-price">{{product.realPrice}}</i> 起
											<i class="line-through">￥{{product.price}}</i>
										</span>
										<x-icon type="ios-plus" size="25"></x-icon>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- <div class="cart-wrapper">
				<span class="cart-pic" @click.native="cartModalShow=true">
					<img src="../../images/cart.png" />
					<badge text="8"></badge>
				</span>
				<div class="pay-btn" @click="goPay">去结算</div>
			</div> -->
		</div>
		<transition name="swipe-up">
			<div class="product-mask" v-transfer-dom v-show="productModalShow">
				<div class="product-modal">
					<div ref="productDetail" class="detail-wrapper">
						<div class="detail-inner">
							<spec-list v-for="(item,index) in specListData" :label="item.type" v-model="item.selectSpec" :specs="item.list" :key="index" />
							<div class="product-desc">
								<span class="title">商品描述</span>
								<p class="desc">{{selectProduct.description}}</p>
							</div>
							<div class="cart">
								<div class="cart-info">
									<span class="price">￥{{totalPrice}}
										<i class="line-through">￥{{originTotalPrice}}</i>
									</span>
									<p class="spec">
										{{selectProduct.name}} ¥{{selectProduct.realPrice + this.extraPrice}} {{specListText}}
									</p>
								</div>
								<div class="count">
									<x-icon type="ios-minus-outline" size="25" @click.native.stop="minus"></x-icon>
									<span class="num">{{count}}</span>
									<x-icon type="ios-plus" size="25" @click.native.stop="add"></x-icon>
								</div>
							</div>
						</div>
					</div>
					<div class="footer-bar">
						<div class="pay-btn" @click="goPay">去结算</div>
					</div>
				</div>
				<div class="close" @click="productModalShow=false;">
					<x-icon type="ios-close-empty" size="30"></x-icon>
				</div>
			</div>
		</transition>
		<div v-transfer-dom>
			<popup class="shop-list" v-model="shopListPopup" height="200">
				<picker :data='shopList' v-model="selectShop" @on-change="changeShop"></picker>
			</popup>
		</div>
		<div v-transfer-dom class="loading-mask" v-show="loading">
			<loading :show="loading" position="absolute"></loading>
		</div>
		<transition name="swipe-up">
			<div class="cart-modal" v-transfer-dom v-show="cartModalShow">
				<div>商品1</div>
				<div>商品2</div>
			</div>
		</transition>
	</div>
</template>
<script>
import BScroll from 'better-scroll';
import { Picker, Popup, TransferDom } from 'vux';
import { Swiper, Slide } from 'vue-swiper-component';
import SpecList from '@/components/SpecList/SpecList';
import { fixPrice } from '@/services/utils';
import gpsCovert from '@/services/gpsConvert';
import {
	getShopList,
	getCategoryByShop,
	getProductsByCategory,
	getBanners,
	getProductDetail,
} from '@/services/getData';
import { IMG_PATH } from '@/config';
const scrollOption = {
	click: true,
	tap: true,
};
import menu1 from '@/images/menu/menu_1.png';
import menu2 from '@/images/menu/menu_2.png';
import menu3 from '@/images/menu/menu_3.png';
import menu4 from '@/images/menu/menu_4.png';
import menu5 from '@/images/menu/menu_5.png';
export default {
	components: {
		Picker,
		Popup,
		SpecList,
		Swiper,
		Slide
	},
	directives: {
		TransferDom,
	},
	data() {
		return {
			swiperOption: {
				// autoplay: { delay: 3000, stopOnLastSlide: false, disableOnInteraction: false },
				// pagination: {
				// 	el: '.swiper-pagination',
				// 	// dynamicBullets: true,
				// 	// touchMoveStopPropagation : false,
				// },
				spaceBetween: 0,
				centeredSlides: true,
				autoplay: {
					delay: 2500,
					disableOnInteraction: false,
				},
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
			},
			loading: false,
			detailScroll: null,
			productScroll: null,
			products: [],
			firstShowDetail: true,
			categoryIndex: 0,
			categories: [],
			bannerList: [],
			productModalShow: false,
			count: 0,
			selectProduct: {},
			shopListPopup: false,
			shopList: [['']],
			selectShop: [],
			address: '',
			gpsPoint: null,
			specListData: [],
			cartModalShow: false,
			goods: [],
			listHeight: [],
			categoryScroll: null,
			scrollY: 0,
			currentIndex: 0,
		};
	},
	computed: {
		specListText() {
			return this.specListData.map(i => i.selectSpec.name).join(' ');
		},
		extraPrice() {
			return this.specListData.reduce((total, i) => fixPrice(i.selectSpec.moreMoney + total), 0);
		},
		totalPrice() {
			const { realPrice = 0, price = 0 } = this.selectProduct;
			return fixPrice((+realPrice + this.extraPrice) * this.count);
		},
		originTotalPrice() {
			const { realPrice = 0, price = 0 } = this.selectProduct;
			return fixPrice((+price + this.extraPrice) * this.count);
		},
		// currentIndex() {
		// 	 console.log('scrollY'+this.scrollY);
		// 	// console.log( this.listHeight);
		// 	for (let i = 0; i < this.listHeight.length; i++) {
		// 		let height1 = this.listHeight[i];
		// 		let height2 = this.listHeight[i + 1];
		// 		if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
		// 			this.test(i);
		// 			this.followScroll(i);
		// 		// 	console.log(i);
		// 		// 	return i;
		// 		}
		// 	}
		// 	return 0;
		// },
	},
	watch: {
		scrollY(val) {
			for (let i = 0; i < this.listHeight.length; i++) {
				let height1 = this.listHeight[i];
				let height2 = this.listHeight[i + 1];
				if (!height2 || (val >= height1 && val < height2)) {
					this.followScroll(i);
					break;
				}
			}
		},
	},
	methods: {
		test(i) {
			console.log('test');
		},
		selectCategory(index, event) {
			// this.categoryIndex = index;
			// this.productScroll && this.productScroll.scrollTo(0, 0, 500);
			// categoryId &&
			// 	getProductsByCategory(this.selectShop[0], categoryId).then(res => {
			// 		res = res || [];
			// 		this.products = res.map(i => {
			// 			i.showImg = IMG_PATH + i.imgs.split(',')[0];
			// 			return i;
			// 		});
			// 		this.$nextTick(() => {
			// 			this.productScroll && this.productScroll.refresh();
			// 		});
			// 	});

			if (!event._constructed) {
				return;
			}
			let productList = this.$refs.productList;
			let el = productList[index];
			this.productScroll.scrollToElement(el, 300);
		},
		minus() {
			if (this.count > 1) --this.count;
		},
		add() {
			if (this.count < 999) ++this.count;
		},
		goPay() {
			this.productModalShow = false;
			const orderGoods = [
				{
					goodsId: this.selectProduct.id,
					goodsName: this.selectProduct.name,
					goodsNum: this.count,
					extraPrice: this.extraPrice,
					price: this.selectProduct.price,
					realPrice: this.selectProduct.realPrice,
					discount: this.selectProduct.discount,
					imgs: this.selectProduct.imgs,
					totalPrice: this.totalPrice,
					specListText: this.specListText,
					specList: this.specListData.map(i => ({
						type: i.selectSpec.name,
						name: i.type,
					})),
				},
			];
			this.$nextTick(() => {
				this.$router.push({ name: 'orderConfirm', params: { orderGoods: orderGoods } });
			});
		},
		showShopPopup() {
			this.shopListPopup = true;
		},
		showProductModal(productId) {
			this.loading = this.productModalShow = true;
			this.detailScroll && this.detailScroll.scrollTo(0, 0, 500);
			getProductDetail(productId).then(res => {
				this.selectProduct = res || { spec: [] };
				let obj = {};
				this.specListData = [];
				res.spec.forEach(e => {
					const { type, name, moreMoney } = e;
					if (!obj[type]) obj[type] = { type, list: [] };
					obj[type].list.push(e);
				});
				for (let i in obj) {
					let data = obj[i];
					data.selectSpec = data.list[0];
					this.specListData.push(data);
				}
				this.count = 1;
				this.loading = false;
				this.$nextTick(() => {
					this.detailScroll && this.detailScroll.refresh();
				});
			});
			if (this.firstShowDetail) {
				this.firstShowDetail = false;
				this.$nextTick(() => {
					this.detailScroll = new BScroll('.detail-wrapper', scrollOption);
				});
			}
		},
		getName(lon, lat) {
			this.gpsPoint = {
				lon,
				lat,
			};
			let json = gpsCovert.bd_encrypt(lat, lon);
			let myGeo = new BMap.Geocoder();
			// 根据坐标得到地址描述
			myGeo.getLocation(new BMap.Point(json.lon, json.lat), result => {
				if (result) {
					this.address = result.address;
				}
			});
		},
		changeShop(val) {
			this.loading = true;
			const shopId = +val[0];
			this.$store.commit('setShopInfo', this.shopList[0].find(i => i.value == shopId));
			this.loadDataByOneShop(shopId);
		},
		getBanners(shopId) {
			return getBanners(shopId).then(res => {
				if (res) {
					for (let i of res) {
						this.bannerList.push({
							url: i.hrefUrl,
							img: IMG_PATH + i.imageKey,
						});
						//  this.bannerList.push(IMG_PATH + i.imageKey);
					}
				}
			});
		},
		getCategoryByShop(shopId) {
			return getCategoryByShop(shopId).then(res => {
				this.categories = res || [];
				const category = this.categories[0] || {};
				// this.selectCategory(category.id, 0);
			});
		},
		loadDataByOneShop(shopId) {
			//产品清空
			this.products = [];
			this.bannerList = [];
			// Promise.all([this.getBanners(shopId), this.getCategoryByShop(shopId)]).then(() => {
			// 	this.loading = false;
			// });
			Promise.all([this.getBanners(shopId), this.getGoodsByShop(shopId)]).then(() => {
				this.$nextTick(() => {
					this._initSroll();
					this._cacluateHeight();
				});
				this.loading = false;
			});
		},
		getGoodsByShop(shopId) {
			const goods = [
				{
					id: 4,
					shopId: 1,
					parentId: 0,
					name: '经典热咖啡系列',
					isShow: true,
					sort: 1,
					dataFlag: 1,
					createDateTime: '2018-07-22T12:39:50',
					product: [
						{
							id: 20,
							code: '020',
							name: '卡布基诺咖啡',
							shopId: 1,
							goodsCatsId: 4,
							createDateTime: '2018-07-22T17:20:49',
							status: 1,
							description: '卡布基诺咖啡',
							price: 10,
							discount: 0,
							realPrice: 10,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/rekafei/kabuqiluo_1.png',
						},
						{
							id: 21,
							code: '021',
							name: '美式咖啡',
							shopId: 1,
							goodsCatsId: 4,
							createDateTime: '2018-07-22T17:20:52',
							status: 1,
							description: '美式咖啡',
							price: 8,
							discount: 0,
							realPrice: 8,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/rekafei/bingmeishi_1.png',
						},
						{
							id: 22,
							code: '022',
							name: '拿铁咖啡',
							shopId: 1,
							goodsCatsId: 4,
							createDateTime: '2018-07-22T17:20:55',
							status: 1,
							description: '拿铁咖啡',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/rekafei/natie_1.png',
						},
						{
							id: 23,
							code: '023',
							name: '意式浓缩咖啡',
							shopId: 1,
							goodsCatsId: 4,
							createDateTime: '2018-07-22T17:20:59',
							status: 1,
							description: '意式浓缩咖啡',
							price: 8,
							discount: 0,
							realPrice: 8,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/rekafei/yishinongsuo_1.png',
						},
						{
							id: 24,
							code: '024',
							name: '招牌卡布基诺咖啡',
							shopId: 1,
							goodsCatsId: 4,
							createDateTime: '2018-07-22T17:21:07',
							status: 1,
							description: '招牌卡布基诺咖啡',
							price: 11,
							discount: 0,
							realPrice: 11,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/rekafei/zhaobaikabuqiluoda_1.png',
						},
						{
							id: 25,
							code: '025',
							name: '招牌美式咖啡',
							shopId: 1,
							goodsCatsId: 4,
							createDateTime: '2018-07-22T17:21:13',
							status: 1,
							description: '招牌美式咖啡',
							price: 9,
							discount: 0,
							realPrice: 9,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/rekafei/zhaopaimeishi_1.png',
						},
						{
							id: 26,
							code: '026',
							name: '招牌拿铁咖啡',
							shopId: 1,
							goodsCatsId: 4,
							createDateTime: '2018-07-22T17:21:20',
							status: 1,
							description: '招牌拿铁咖啡',
							price: 13,
							discount: 0,
							realPrice: 13,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/rekafei/zhaopainatie_1.png',
						},
						{
							id: 27,
							code: '027',
							name: '招牌意式浓缩咖啡',
							shopId: 1,
							goodsCatsId: 4,
							createDateTime: '2018-07-22T17:21:27',
							status: 1,
							description: '招牌意式浓缩咖啡',
							price: 9,
							discount: 0,
							realPrice: 9,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/rekafei/zhaopaiyisinongsuo_1.png',
						},
					],
				},
				{
					id: 3,
					shopId: 1,
					parentId: 0,
					name: '经典冰咖啡系列',
					isShow: true,
					sort: 2,
					dataFlag: 1,
					createDateTime: '2018-07-22T12:39:32',
					product: [
						{
							id: 14,
							code: '014',
							name: '冰卡布基诺咖啡',
							shopId: 1,
							goodsCatsId: 3,
							createDateTime: '2018-07-22T16:58:38',
							status: 1,
							description: '冰卡布基诺咖啡',
							price: 11,
							discount: 0,
							realPrice: 11,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/bingkafei/bingkabuqiluokafei_1.png',
						},
						{
							id: 15,
							code: '015',
							name: '冰美式咖啡',
							shopId: 1,
							goodsCatsId: 3,
							createDateTime: '2018-07-22T16:58:44',
							status: 1,
							description: '冰美式咖啡',
							price: 9,
							discount: 0,
							realPrice: 9,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/bingkafei/bingmeishikafei_1.png',
						},
						{
							id: 16,
							code: '016',
							name: '冰拿铁咖啡',
							shopId: 1,
							goodsCatsId: 3,
							createDateTime: '2018-07-22T16:58:50',
							status: 1,
							description: '冰拿铁咖啡',
							price: 13,
							discount: 0,
							realPrice: 13,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/bingkafei/bingnatiekafei_1.png',
						},
						{
							id: 17,
							code: '017',
							name: '招牌冰卡布基诺咖啡',
							shopId: 1,
							goodsCatsId: 3,
							createDateTime: '2018-07-22T16:59:06',
							status: 1,
							description: '招牌冰卡布基诺咖啡',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/bingkafei/zhaopaibingkabuqiluo_1.png',
						},
						{
							id: 18,
							code: '018',
							name: '招牌冰美式咖啡',
							shopId: 1,
							goodsCatsId: 3,
							createDateTime: '2018-07-22T16:59:11',
							status: 1,
							description: '招牌冰美式咖啡',
							price: 10,
							discount: 0,
							realPrice: 10,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/bingkafei/zhaopaibingmeishi_1.png',
						},
						{
							id: 19,
							code: '019',
							name: '招牌冰拿铁咖啡',
							shopId: 1,
							goodsCatsId: 3,
							createDateTime: '2018-07-22T16:59:15',
							status: 1,
							description: '招牌冰拿铁咖啡',
							price: 14,
							discount: 0,
							realPrice: 14,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/bingkafei/zhaopaibingnatie_1.png',
						},
					],
				},
				{
					id: 5,
					shopId: 1,
					parentId: 0,
					name: '咖啡机鲜萃茶系列',
					isShow: true,
					sort: 3,
					dataFlag: 1,
					createDateTime: '2018-07-22T12:40:09',
					product: [
						{
							id: 28,
							code: '028',
							name: '阿里山冰茶',
							shopId: 1,
							goodsCatsId: 5,
							createDateTime: '2018-07-22T17:28:28',
							status: 1,
							description: '阿里山冰茶',
							price: 10,
							discount: 0,
							realPrice: 10,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/cha/alishanbingcha_1.png',
						},
						{
							id: 29,
							code: '029',
							name: '茉莉绿茶',
							shopId: 1,
							goodsCatsId: 5,
							createDateTime: '2018-07-22T17:28:54',
							status: 1,
							description: '茉莉绿茶',
							price: 10,
							discount: 0,
							realPrice: 10,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/cha/molilvcha_1.png',
						},
						{
							id: 30,
							code: '030',
							name: '炭焙乌龙',
							shopId: 1,
							goodsCatsId: 5,
							createDateTime: '2018-07-22T17:28:58',
							status: 1,
							description: '炭焙乌龙',
							price: 10,
							discount: 0,
							realPrice: 10,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/cha/tanbeiwulong_1.png',
						},
						{
							id: 31,
							code: '031',
							name: '乌龙青茶',
							shopId: 1,
							goodsCatsId: 5,
							createDateTime: '2018-07-22T17:29:01',
							status: 1,
							description: '乌龙青茶',
							price: 10,
							discount: 0,
							realPrice: 10,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/cha/wulongqingcha_1.png',
						},
					],
				},
				{
					id: 1,
					shopId: 1,
					parentId: 0,
					name: '冰沙系列',
					isShow: true,
					sort: 4,
					dataFlag: 1,
					createDateTime: '2018-07-17T22:59:07',
					product: [
						{
							id: 1,
							code: '001',
							name: '百香果冰沙',
							shopId: 1,
							goodsCatsId: 1,
							createDateTime: '2018-07-17T22:55:57',
							status: 1,
							description: '百香果沙冰',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/baixiangbingsha_1.png',
						},
						{
							id: 2,
							code: '002',
							name: '草莓冰沙',
							shopId: 1,
							goodsCatsId: 1,
							createDateTime: '2018-07-18T23:03:02',
							status: 1,
							description: '草莓冰沙',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/caomeibingsha_1.png',
						},
						{
							id: 3,
							code: '003',
							name: '凤梨冰沙',
							shopId: 1,
							goodsCatsId: 1,
							createDateTime: '2018-07-22T16:40:16',
							status: 1,
							description: '凤梨冰沙',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/fenglibingsha_1.png',
						},
						{
							id: 4,
							code: '004',
							name: '红豆牛奶冰沙',
							shopId: 1,
							goodsCatsId: 1,
							createDateTime: '2018-07-22T16:43:03',
							status: 1,
							description: '红豆牛奶冰沙',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/hongdouniunaibingsha_1.png',
						},
						{
							id: 5,
							code: '005',
							name: '柳橙冰沙',
							shopId: 1,
							goodsCatsId: 1,
							createDateTime: '2018-07-22T16:43:07',
							status: 1,
							description: '柳橙冰沙',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/liuchengbingsha_1.png',
						},
						{
							id: 6,
							code: '006',
							name: '绿豆牛奶冰沙',
							shopId: 1,
							goodsCatsId: 1,
							createDateTime: '2018-07-22T16:43:10',
							status: 1,
							description: '绿豆牛奶冰沙',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/lvdouniunaibingsha_1.png',
						},
						{
							id: 7,
							code: '007',
							name: '芒果冰沙',
							shopId: 1,
							goodsCatsId: 1,
							createDateTime: '2018-07-22T16:43:14',
							status: 1,
							description: '芒果冰沙',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/mangguobingsha_1.png',
						},
						{
							id: 8,
							code: '008',
							name: '奇异果冰沙',
							shopId: 1,
							goodsCatsId: 1,
							createDateTime: '2018-07-22T16:43:17',
							status: 1,
							description: '奇异果冰沙',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/qiyiguobingsha_1.png',
						},
					],
				},
				{
					id: 6,
					shopId: 1,
					parentId: 0,
					name: '苏打水系列',
					isShow: true,
					sort: 5,
					dataFlag: 1,
					createDateTime: '2018-07-22T12:40:27',
					product: [
						{
							id: 32,
							code: '032',
							name: '百香果苏打水',
							shopId: 1,
							goodsCatsId: 6,
							createDateTime: '2018-07-22T17:35:24',
							status: 1,
							description: '百香果苏打水',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/sudashui/baixiangguo_1.png',
						},
						{
							id: 33,
							code: '033',
							name: '草莓苏打水',
							shopId: 1,
							goodsCatsId: 6,
							createDateTime: '2018-07-22T17:35:27',
							status: 1,
							description: '草莓苏打水',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/sudashui/caomei_1.png',
						},
						{
							id: 34,
							code: '034',
							name: '蓝橘苏打水',
							shopId: 1,
							goodsCatsId: 6,
							createDateTime: '2018-07-22T17:35:31',
							status: 1,
							description: '蓝橘苏打水',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/sudashui/lanju_1.png',
						},
						{
							id: 35,
							code: '035',
							name: '芒果苏打水',
							shopId: 1,
							goodsCatsId: 6,
							createDateTime: '2018-07-22T17:35:35',
							status: 1,
							description: '芒果苏打水',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/sudashui/mangguo_1.png',
						},
						{
							id: 36,
							code: '036',
							name: '青柠苏打水',
							shopId: 1,
							goodsCatsId: 6,
							createDateTime: '2018-07-22T17:35:39',
							status: 1,
							description: '青柠苏打水',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/sudashui/qingning_1.png',
						},
						{
							id: 37,
							code: '037',
							name: '水蜜桃苏打',
							shopId: 1,
							goodsCatsId: 6,
							createDateTime: '2018-07-22T17:35:42',
							status: 1,
							description: '水蜜桃苏打',
							price: 12,
							discount: 0,
							realPrice: 12,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/sudashui/shuimitao_1.png',
						},
					],
				},
				{
					id: 2,
					shopId: 1,
					parentId: 0,
					name: '糕点系列',
					isShow: true,
					sort: 6,
					dataFlag: 1,
					createDateTime: '2018-07-19T22:56:05',
					product: [
						{
							id: 9,
							code: '009',
							name: '草莓QQ松饼',
							shopId: 1,
							goodsCatsId: 2,
							createDateTime: '2018-07-22T16:46:32',
							status: 1,
							description: '草莓QQ松饼',
							price: 7,
							discount: 0,
							realPrice: 7,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/gaodian/caomeiqqsongbing_1.png',
						},
						{
							id: 10,
							code: '010',
							name: '芒果QQ松饼',
							shopId: 1,
							goodsCatsId: 2,
							createDateTime: '2018-07-22T16:48:18',
							status: 1,
							description: '芒果QQ松饼',
							price: 7,
							discount: 0,
							realPrice: 7,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/gaodian/mangguoqqsongbing_1.png',
						},
						{
							id: 11,
							code: '011',
							name: '巧克力玛芬蛋糕',
							shopId: 1,
							goodsCatsId: 2,
							createDateTime: '2018-07-22T16:48:23',
							status: 1,
							description: '巧克力玛芬蛋糕',
							price: 6,
							discount: 0,
							realPrice: 6,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/gaodian/qiaokelimafengdangao_1.png',
						},
						{
							id: 12,
							code: '012',
							name: '原味QQ松饼',
							shopId: 1,
							goodsCatsId: 2,
							createDateTime: '2018-07-22T16:49:16',
							status: 1,
							description: '原味QQ松饼',
							price: 6,
							discount: 0,
							realPrice: 6,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/gaodian/yuanweimafengdagao_1.png',
						},
						{
							id: 13,
							code: '013',
							name: '原味玛芬蛋糕',
							shopId: 1,
							goodsCatsId: 2,
							createDateTime: '2018-07-22T16:49:19',
							status: 1,
							description: '原味玛芬蛋糕',
							price: 5,
							discount: 0,
							realPrice: 5,
							saleNum: 0,
							visitNum: 0,
							dataFlag: 1,
							imgs: '/oleccoffee-test/gaodian/yuanweiqqsongbing.png',
						},
					],
				},
			];
			goods.map(i => {
				i.product.map(e => {
					e.showImg = IMG_PATH + e.imgs.split(',')[0];
				});
			});
			this.goods = goods;

			return Promise.resolve(goods);
		},
		_initSroll() {
			this.categoryScroll = new BScroll('.category-wrapper', {
				click: true,
			});
			this.productScroll = new BScroll('.product-wrapper', {
				click: true,
				probeType: 3,
			});
			this.productScroll.on('scroll', pos => {
				if (pos.y <= 0) {
					this.scrollY = Math.abs(Math.round(pos.y));
				}
			});
		},
		_cacluateHeight() {
			let productList = this.$refs.productList;
			let height = 0;
			this.listHeight.push(height);
			for (let i = 0; i < productList.length; i++) {
				let item = productList[i];
				height += item.clientHeight;
				this.listHeight.push(height);
			}
		},
		followScroll(index) {
			this.currentIndex = index;
			let categoryList = this.$refs.categoryList;
			let el = categoryList[index];
			this.categoryScroll.scrollToElement(el, 300, 0, -100);
		},
	},
	created() {
		this.loading = true;
		getShopList({
			start: 0,
			length: 1000,
		}).then(res => {
			res = res || [];
			if (res instanceof Array) {
				for (let i of res) {
					i.value = i.id;
				}
				this.shopList = [res];
			} else {
				res.value = res.id;
				this.shopList = [[res]];
			}
			this.$store.commit('setShopInfo', this.shopList[0][0] || {});
		});
	},
	mounted() {
		// this.$nextTick(() => {
		// 	new BScroll('.category-wrapper', scrollOption);
		// 	this.productScroll = new BScroll('.product-wrapper', scrollOption);
		// });
		this.$wechat.ready(() => {
			this.$wechat.getLocation({
				type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: res => {
					this.getName(res.longitude, res.latitude);
				},
				cancel: function(res) {},
			});
		});
	},
};
</script>

