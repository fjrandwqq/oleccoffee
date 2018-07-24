<style lang="less" scoped src="./HomePage.less"></style>
<template>
	<div id="home-page">
		<div class="address">
			<div class="address-left" @click="showShopPopup">
				<img src="../../images/mark.png" height="18">
				<span>{{address}}</span>
				<x-icon type="ios-arrow-right" size="20"></x-icon>
			</div>
			<a class="phone" href="tel:13538809560">
				<img src="../../images/phone.png" height="20">
			</a>
		</div>
		<div class="content">
			<div class="swiper-wrapper">
				<swiper auto loop :show-dots="false" height="100%" :list="bannerList" v-model="swiperIndex"></swiper>
			</div>
			<div class="shop-wrapper">
				<div class="catogory-wrapper">
					<div class="categories">
						<a :class="{active:categoryIndex==index}" @click="selectCategory(categories,index)" v-for="(category,index) in categories" class="category needsclick" :key="index">
							{{category.name||''}}
						</a>
					</div>
				</div>
				<div class="product-wrapper">
					<div class="products">
						<p class="category-title">{{categories.length>0&&categories[categoryIndex].name}}</p>
						<div class="product" v-for="(product,index) in products" :key="index" @click="showProductModal(product)">
							<div class="product-img" :style="{background:'url('+product.imgs+') center no-repeat'}"></div>
							<div class="product-info">
								<span class="product-name">{{product.name}}</span>
								<p>
									<span class="product-price">￥
										<i>{{product.price}}</i>
									</span>
									<x-icon type="ios-plus" size="25"></x-icon>
								</p>
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
							<spec-list :specs="specList" label="规格" v-model="spec" />
							<spec-list :specs="temperatureList" label="温度" v-model="temperature" />
							<spec-list :specs="sugarList" label="糖" v-model="sugar" />
							<spec-list :specs="milkList" label="奶" v-model="milk" />
							<div class="product-desc">
								<span class="title">商品描述</span>
								<p class="desc">{{selectProduct.description}}</p>
							</div>
							<div class="cart">
								<div class="cart-info">
									<span class="price">￥{{totalPrice}}</span>
									<p class="spec">{{selectProduct.name}} ¥{{selectProduct.price}}</p>
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
	</div>
</template>
<script>
import BScroll from "better-scroll";
import { Swiper, Picker, Popup, TransferDom } from "vux";
import SpecList from "@/components/SpecList/SpecList";
import { fixPrice } from "@/services/utils";
import gpsCovert from '@/services/gpsConvert';
import { getShopList, getCategoryByShop, getProductsByCategory, getBanners, getProductDetail } from "@/services/getData";
const scrollOption = {
	click: true,
	tap: true,
};
const specList = [
	{
		text: '小'
	},
	{
		text: '大'
	}
];
const sugarList = [{
	text: '无糖'
}, {
	text: '少糖'
}, {
	text: '多糖'
}, {
	text: '正常'
}];
const milkList = [{
	text: '无奶'
}, {
	text: '单份奶'
}, {
	text: '双份奶'
}];
const temperatureList = [{
	text: '冰'
}, {
	text: '热'
}];
export default {
	components: {
		Swiper,
		Picker,
		Popup,
		SpecList,
	},
	directives: {
		TransferDom,
	},
	data() {
		return {
			firstShowDetail: true,
			swiperIndex: 0,
			categoryIndex: 0,
			specList,
			milkList,
			temperatureList,
			sugarList,
			milk: milkList[0].text,
			temperature: temperatureList[0].text,
			sugar: sugarList[0].text,
			spec: specList[0].text,
			// products: [{
			// 	name: 'sdfasf',
			// 	price: 60,
			// 	id: 1
			// }],
			products:[],
			categories: [],
			bannerList: [],
			productModalShow: false,
			count: 0,
			totalPrice: 0,
			selectProduct: {},
			shopListPopup: false,
			shopList: [['']],
			selectShop: [],
			address:'',
			gpsPoint:null,
		};
	},
	watch: {
		count(val, oldVal = 0) {
			const price = +this.selectProduct.price;
			this.totalPrice = fixPrice(price * oldVal);
			this.changeTotalPrice(fixPrice(price * val));
		},
	},
	methods: {
		changeTotalPrice(targetNum, elapsedTime = 1000, gap) {
			requestAnimationFrame(() => {
				const isInt = this.selectProduct.price % 1 == 0;
				if (!gap) gap = fixPrice(Math.abs(targetNum - this.totalPrice) / elapsedTime * 60);
				if (isInt) gap = Math.floor(gap);
				if (targetNum > this.totalPrice) {
					this.totalPrice = fixPrice(this.totalPrice + gap);
					if (this.totalPrice > targetNum) {
						this.totalPrice = targetNum;
					}
				} else {
					this.totalPrice = fixPrice(this.totalPrice - gap);
					if (this.totalPrice < targetNum) {
						this.totalPrice = targetNum;
					}
				}
				if (this.totalPrice != targetNum) {
					this.changeTotalPrice(targetNum, elapsedTime, gap);
				}
			});
		},
		selectCategory(category, index) {
			this.categoryIndex = index;
			category.length>0&&getProductsByCategory(this.selectShop[0], category[index].id).then(res => {
				this.products = res || [];
			});
		},
		minus() {
			if (this.count > 1)--this.count;
		},
		add() {
			if (this.count < 999)++this.count;
		},
		goPay() {
			this.productModalShow = false;
			this.$nextTick(() => {
				this.$router.push('orderConfirm');
			});
		},
		showShopPopup() {
			this.shopListPopup = true;
		},
		showProductModal(product) {
			this.selectProduct = product;
			this.productModalShow = true;
			this.count = 1;
			getProductDetail(product.id).then(res => {
				console.log(res);
			});
			if (this.firstShowDetail) {
				this.firstShowDetail = false;
				this.$nextTick(() => {
					new BScroll('.detail-wrapper', scrollOption);
				});
			}

		},
		getName(lon,lat){
			this.gpsPoint={
				lon:lon,
				lat:lat
			};
			let json = gpsCovert.bd_encrypt(lat, lon);
			let myGeo = new BMap.Geocoder();
			let that=this;
			// 根据坐标得到地址描述
			myGeo.getLocation(new BMap.Point(json.lon, json.lat), function(result) {
				if (result) {
					// document.getElementById('address').innerHTML=result.address;
					that.address=result.address;
				}
			});
		},
		changeShop(val){
			console.log(val);
			this.loadDataByOneShop(val[0]);
		},
		loadDataByOneShop(shopId){
			getBanners(shopId).then(res => {
				if (res) {
					for (let i of res) {
						i.url = 'javascript:';
						i.img = i.hrefUrl;
					}
					this.bannerList = res;
				}
			});
			getCategoryByShop(shopId).then(res => {
				this.categories = res || [];
				this.selectCategory(this.categories, 0);
			});
		}
	},
	created() {
		getShopList({
			start: 0,
			length: 1000
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
			let shopId;
			this.shopList[0][0]!==''&&(shopId=[this.shopList[0][0].id]);
			shopId&&this.loadDataByOneShop(shopId);
		})
	},
	mounted() {
		this.$nextTick(() => {
			new BScroll('.catogory-wrapper', scrollOption);
			new BScroll('.product-wrapper', scrollOption);
		});
		this.$wechat.ready(() => {
			let that=this;
			this.$wechat.getLocation({
				type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function (res) {
					that.getName(res.longitude,res.latitude);
					//使用微信内置地图查看位置接口
					console.log(res.latitude + '//纬度' + res.longitude);
				},
				cancel: function (res) {

				}
			});

		});
	},
};
</script>

