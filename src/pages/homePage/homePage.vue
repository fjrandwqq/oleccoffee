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
							{{category.name}}
						</a>
					</div>
				</div>
				<div class="product-wrapper">
					<div class="products">
						<p class="category-title">{{categories.length>0&&categories[categoryIndex].name||'暂无'}}</p>
						<div class="product" v-for="(product,index) in products" :key="index" @click="showProductModal(product)">
							<div class="product-img" :style="{background:'url('+product.imgs+') center no-repeat'}"></div>
							<div class="product-info">
								<span class="product-name">{{product.name}}</span>
								<p>￥
									<span class="text-decoration-line">{{product.realprice}}</span>
								</p>
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
							<spec-list v-for="(item,index) in specListData" :label="item.label" v-model="item.id" :specs="item.list" :key="index" @change="changeSpecList" />
							<div class="product-desc">
								<span class="title">商品描述</span>
								<p class="desc">{{selectProduct.description}}</p>
							</div>
							<div class="cart">
								<div class="cart-info">
									<span class="price">￥{{totalPrice}}</span>
									<p class="spec">{{selectProduct.name}} ￥
										<span class="text-decoration-line">{{selectProduct.price}}</span> ¥{{selectProduct.realPrice}}</p>
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
import BScroll from 'better-scroll';
import { Swiper, Picker, Popup, TransferDom } from 'vux';
import SpecList from '@/components/SpecList/SpecList';
import { fixPrice } from '@/services/utils';
import gpsCovert from '@/services/gpsConvert';
import {
	getShopList,
	getCategoryByShop,
	getProductsByCategory,
	getBanners,
	getProductDetail,
	imgPath,
} from '@/services/getData';
const scrollOption = {
	click: true,
	tap: true,
};
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
			categories: [],
			bannerList: [],
			productModalShow: false,
			count: 0,
			totalPrice: 0,
			selectProduct: {},
			shopListPopup: false,
			shopList: [['']],
			selectShop: [],
			address: '',
			gpsPoint: null,
			specListData:[]
		};
	},
	watch: {
		count(val, oldVal = 0) {
			this.changeTotalPrice();
			// this.changeTotalPrice(fixPrice(price * val));
		},
	},
	methods: {
		changeTotalPrice(){
			if(this.selectProduct.realPrice){
				const realPrice = +this.selectProduct.realPrice;
				this.totalPrice = fixPrice(realPrice * this.count);
			}
		},
		selectCategory(category, index) {
			this.categoryIndex = index;
			category.length > 0 &&
				getProductsByCategory(this.selectShop[0], category[index].id).then(res => {
					this.products = res || [];
				});
		},
		minus() {
			if (this.count > 1) --this.count;
		},
		add() {
			if (this.count < 999) ++this.count;
		},
		goPay() {
			this.productModalShow = false;
			let specList=[];
			this.specListData.forEach(e=>{
				specList.push({
					type:e.id,
					name:e.label
				});
			});
			const orderGoods=[{
				goodsId:this.selectProduct.id,
				goodsName:this.selectProduct.name,
				goodsNum: this.count,
				price:this.selectProduct.price,
				realPrice:this.selectProduct.realPrice,
				discount:this.selectProduct.discount,
				imgs:this.selectProduct.imgs,
				totalPrice:this.totalPrice,
				specList:specList
			}];
			console.log('-------------');
			console.log(orderGoods);
			console.log('-------------');
			this.$nextTick(() => {
				this.$router.push({name:'orderConfirm',params:{orderGoods:orderGoods}});
			});
		},
		showShopPopup() {
			this.shopListPopup = true;
		},
		showProductModal(product) {
			// this.selectProduct = product;
			this.productModalShow = true;
			getProductDetail(product.id).then(res => {
				this.selectProduct=res;
				let i=0;
				this.specListData=[];
				res.spec.forEach(e=>{
					for(i=0;i<this.specListData.length;i++){
						if(this.specListData[i].label === e.type){
							this.specListData[i].list.push({
								text:e.name,
								moreMoney:e.moreMoney
							});
							break;
						}
					}
					if(i>=this.specListData.length){
						this.specListData.push({
							label:e.type,
							id:e.name,
							list:[{
								text:e.name,
								moreMoney:e.moreMoney
							}]
						})
					}
				});
				console.log(this.specListData);
				//选中产品的价格是默认选择了所有规格第一项的价格，例如大杯默认，加多10块 20+10 =30
				for(let item of this.specListData){
					this.selectProduct.price=fixPrice(this.selectProduct.price+item.list[0].moreMoney);
					this.selectProduct.realPrice=fixPrice(this.selectProduct.realPrice+=item.list[0].moreMoney);
				}
				console.log(this.selectProduct);
				this.count=1;
			});

			if (this.firstShowDetail) {
				this.firstShowDetail = false;
				this.$nextTick(() => {
					new BScroll('.detail-wrapper', scrollOption);
				});
			}
		},
		changeSpecList(oldVal, newVal) {
			this.selectProduct.price = fixPrice(this.selectProduct.price - oldVal.moreMoney + newVal.moreMoney);
			this.selectProduct.realPrice = fixPrice(this.selectProduct.realPrice - oldVal.moreMoney + newVal.moreMoney);
			this.changeTotalPrice();
		},
		getName(lon, lat) {
			this.gpsPoint = {
				lon: lon,
				lat: lat,
			};
			let json = gpsCovert.bd_encrypt(lat, lon);
			let myGeo = new BMap.Geocoder();
			let that = this;
			// 根据坐标得到地址描述
			myGeo.getLocation(new BMap.Point(json.lon, json.lat), function(result) {
				if (result) {
					that.address = result.address;
				}
			});
		},
		changeShop(val) {
			let shopInfo = this.getShopByShopId(parseInt(val[0]));
			this.$store.commit('setShopInfo', shopInfo);
			console.log(val);
			this.loadDataByOneShop(parseInt(val[0]));
		},
		getShopByShopId(shopId) {
			for (let item of this.shopList[0]) {
				if (item.value === shopId) {
					return item;
				}
			}
		},
		loadDataByOneShop(shopId) {
			//产品清空
			this.products = [];
			this.bannerList = [];
			getBanners(shopId).then(res => {
				if (res) {
					for (let i of res) {
						i.url = i.hrefUrl;
						i.img = imgPath + i.imageKey;
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
			let shopId;
			if(this.shopList[0][0] !== ''){
				this.$store.commit('setShopInfo', this.shopList[0][0]);
				shopId = [this.shopList[0][0].id];
			}

			shopId && this.loadDataByOneShop(shopId);
		});
	},
	mounted() {
		this.$nextTick(() => {
			new BScroll('.catogory-wrapper', scrollOption);
			new BScroll('.product-wrapper', scrollOption);
		});
		this.$wechat.ready(() => {
			let that = this;
			this.$wechat.getLocation({
				type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function(res) {
					that.getName(res.longitude, res.latitude);
				},
				cancel: function(res) {},
			});
		});
	},
};
</script>

