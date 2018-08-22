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
				<Swiper class="swiper" :autoPlay="true" v-if="bannerList.length > 0">
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
							<div class="product" v-for="(product,index) in category.products" :key="index" @click="showProductModal(product.id)">
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
	getAllGoods,
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
		}
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
			return  getAllGoods(shopId).then(res=>{
			    let goods=res;
			    goods.map(i => {
				i.products.map(e => {
					e.showImg = IMG_PATH + e.imgs.split(',')[0];
				});
				});
				this.goods=goods;
			});
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

