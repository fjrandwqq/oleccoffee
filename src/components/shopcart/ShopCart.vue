<!--
Description 购物车组件(数据通过vuex 来交互,不用组件的方式)
@authors fanjiongrong (fanjiongrong@tvflnet.com)
@date    2018-08-22 17:14:40
@version 1.0.0
-->
<template>
  <div v-show="visible">
    <div class="cart">
      <div class="cart-bar">
        <div class="content-left">
          <div class="pic-wrapper" @click="toggleCartModal()">
            <div class="cart-pic">
              <img src="../../images/cart.png" />
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
           <div class="price">￥{{totalPrice}}</div>
         <!-- <div class="delivery-fee">另需配送费 ￥{{deliveryFee}}</div> -->
        </div>
        <div class="content-right">
          <div class="pay-btn" @click="goPay">去结算</div>
        </div>
      </div>
      <transition name="fold">
        <div class="cart-list" v-show="cartModal">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="product" v-for="(product,index) in cartProducts" :key="index">
                <span class="name">{{product.goodsName}}</span>
                <span class="specText">{{product.specListText}}</span>
                <div class="price">
                  <span>￥{{product.payPrice}}</span>
                </div>
                <div class="count">
                  <x-icon type="ios-minus-outline" size="25" @click.native.stop="minus(index)"></x-icon>
                  <span class="num">{{product.goodsNum}}</span>
                  <x-icon type="ios-plus" size="25" @click.native.stop="add(index)"></x-icon>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="cart-mask" v-show="cartModal" @click="cartModal=false"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import {mapState,mapMutations} from 'vuex';
import { fixPrice } from '@/services/utils';
export default {
	props: {
		value: {
			type: Boolean,
			default: false,
		},
		//清空的时候是否要隐藏购物车
		clearable: {
			type: Boolean,
			default: false,
		},
		deliveryFee: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			visible: this.value,
			cartModal: false,
			scroll: null,
		};
	},
	computed: {
    ...mapState(['cartProducts']),
		totalCount() {
			let sum =
				this.cartProducts.length === 0
					? 0
					: this.cartProducts.reduce((total, e) => {
							return total + e.goodsNum;
					  }, 0);
			return sum;
		},
		totalPrice() {
			let sum = 0;
			this.cartProducts.forEach(e => {
				sum += e.totalPrice;
			});
			return fixPrice(sum);
		},
	},
	watch: {
		value(val) {
			this.visible = val;
		},
		cartModal(val) {
			if (val) {
				this.updateScroll();
			}
		},
	},
	methods: {
    ...mapMutations(['ADD_CART_PRODUCTS','REDUCE_CART_PRODUCTS','CLEAR_CART_PRODUCTS']),
		goPay() {
			this.$emit('go-pay');
		},
		empty() {
			if (this.clearable) {
				this.visible = false;
				this.$emit('input', false);
			}
			this.cartProducts = [];
			this.changeSelectedProducts();
		},
		minus(index) {
			this.cartProducts[index].count > 0 && this.cartProducts[index].count--;
			if (this.cartProducts[index].count === 0) {
				this.cartProducts.splice(index, 1);
			}
			this.changeSelectedProducts();
		},
		add(index) {
			this.cartProducts[index].count < 999 && this.cartProducts[index].count++;
			this.changeSelectedProducts();
		},
		changeSelectedProducts() {
			this.$emit('on-change', this.cartProducts);
		},
		updateScroll() {
			this.$nextTick(() => {
				if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.listContent, {
						click: true,
					});
				} else {
					this.scroll.scrollTo(0, 0, 500);
					this.scroll.refresh();
				}
			});
		},
		toggleCartModal() {
			this.cartModal = !this.cartModal;
		},
	},
};
</script>

<style lang="less" src="./ShopCart.less" scoped>
</style>
