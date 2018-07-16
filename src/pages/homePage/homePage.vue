<style lang="less" scoped src="./HomePage.less"></style>
<template>
  <div id="home-page">
    <div class="address">
      <div class="address-left" @click="showShopPopup">
        <img src="../../images/mark.png" height="20">
        <span>士大夫撒地方的说法是打发沙发啥地方</span>
        <x-icon type="ios-arrow-right" size="15"></x-icon>
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
        <div class="catogory-wrapper" ref="categoryWrapper">
          <div class="categories">
            <a :class="{active:categoryIndex==index}" @click="selectCategory(category,index)" v-for="(category,index) in categories" class="category needsclick" :key="index">
              {{category.text}}
            </a>
          </div>
        </div>
        <div class="product-wrapper" ref="productWrapper">
          <div class="products">
            <p class="category-title">{{categories[categoryIndex].text}}</p>
            <div class="product" v-for="(product,index) in products" :key="index" @click="showProductModal(product)">
              <div class="product-img" :style="{background:'url('+product.src+') center no-repeat'}"></div>
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
          <div ref="productDetail" class="product-detail">
            <div class="detail-inner">
              <spec-list :specs="specs" label="规格" v-model="spec1" />
              <spec-list :specs="specs" label="规格" v-model="spec2" />
              <spec-list :specs="specs" label="规格" v-model="spec3" />
              <div class="product-desc">
                <span class="title">商品描述</span>
                <p class="desc">{{selectProduct.desc}}</p>
              </div>
              <div class="cart">
                <div class="cart-info">
                  <span class="price">￥{{totalPrice}}</span>
                  <p class="spec">{{selectProduct.name}} ¥{{selectProduct.price}}</p>
                </div>
                <div class="count">
                  <x-icon type="ios-minus-outline" size="25" @click.native="minus"></x-icon>
                  <span class="num">{{count}}</span>
                  <x-icon type="ios-plus" size="25" @click.native="add"></x-icon>
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
      <popup :ref="shopList" class="shop-list" v-model="shopListPopup" height="200">
        <picker :data='shopList' v-model="selectShop"  @on-change="changeShop"></picker>
      </popup>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import { Swiper, Picker, Popup, TransferDom } from 'vux';
import SpecList from '@/components/SpecList/SpecList';
import { changeNumber, fixPrice } from '@/services/utils';
const scrollOption = {
	click: true,
	tap: true,
};
const specs = [
	{
		id: 1,
		text: '小',
	},
	{
		id: 3,
		text: '中',
	},
	{
		id: 2,
		text: '打',
	},
	{
		id: 4,
		text: '超大',
	},
];
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
			swiperIndex: 0,
			categoryIndex: 0,
			specs,
			spec1: specs[0].id,
			spec2: specs[0].id,
			spec3: specs[0].id,
			products: [
				{
					price: 29,
					name: '自行车自行车在',
					desc: '啊实打实多啥 ',
					src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
				},
				{
					price: 29,
					name: '自行车自行车在',
					desc: '啊实打实多啥 ',
					src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
				},
				{
					price: 29,
					name: '自行车自行车在',
					desc: '啊实打实多啥 ',
					src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
				},
				{
					price: 29,
					name: '自行车自行车在',
					desc: '啊实打实多啥 ',
					src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
				},
				{
					price: 29,
					name: '自行车自行车在',
					desc: '啊实打实多啥 ',
					src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
				},
				{
					price: 29,
					name: '自行车自行车在',
					desc: '啊实打实多啥 ',
					src: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
				},
			],
			categories: [
				{
					text: '盛大发售发顺丰双方都啥地方',
				},
				{
					text: '盛方都啥地方',
				},
				{
					text: '盛大发售方都啥地方',
				},
				{
					text: '方都啥地方',
				},
				{
					text: '盛大地方',
				},
				{
					text: '啥地方',
				},
				{
					text: '盛大发地方',
				},
				{
					text: '盛啥地方',
				},
				{
					text: '盛大发啥地方',
				},
			],
			bannerList: [
				{
					url: 'javascript:',
					img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
				},
				{
					url: 'javascript:',
					img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
				},
				{
					url: 'javascript:',
					img: 'https://static.vux.li/demo/5.jpg',
					fallbackImg: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg',
				},
			],
			productModalShow: false,
			count: 0,
			totalPrice: 0,
			selectProduct: {},
			shopListPopup: false,
			shopList: [
				[
					{
						name: '萝岗万达星巴克咖啡馆',
						value: 1,
					},
					{
						name: '天河星美广场店铺',
						value: 2,
					},
					{
						name: '萝岗永和大道店铺',
						value: 3,
					},
					{
						name: '深圳百果园咖啡店铺',
						value: 4,
					},
				],
			],
			selectShop: [''],
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
		},
		minus() {
			if (this.count > 1) this.count -= 1;
		},
		add() {
			if (this.count < 999) this.count += 1;
		},
		goPay() {
			this.productModalShow = false;
			this.$nextTick(() => {
				this.$router.push('orderConfirm');
			});
		},
		showProductModal(product) {
			this.selectProduct = product;
			this.productModalShow = true;
			this.count = 1;
			this.$nextTick(() => {
				new BScroll(this.$refs.productDetail, scrollOption);
			});
    },
    showShopPopup(){
      this.shopListPopup=true;
    },
    changeShop(val){
      console.log(val);
    }
	},
	mounted() {
		this.$nextTick(() => {
			let cScroll = new BScroll(this.$refs.categoryWrapper, scrollOption);
			let pScroll = new BScroll(this.$refs.productWrapper, scrollOption);
		});
	},
};
</script>

