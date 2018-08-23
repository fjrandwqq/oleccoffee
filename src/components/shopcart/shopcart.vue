<!--
Description 购物车组件
@authors fanjiongrong (fanjiongrong@tvflnet.com)
@date    2018-08-22 17:14:40
@version 1.0.0
-->
<template>
<div v-show="visible">
  <div class="cart" >
    <div class="cart-bar">
      <div class="content-left">
        <div class="pic-wrapper" @click="toggleCartModal()">
          <div class="cart-pic">
            <img src="../../images/cart.png" />
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price">￥{{totalPrice}}</div>
        <div class="delivery-fee">另需配送费 ￥{{deliveryFee}}</div>
      </div>
      <div class="content-right">
        <div class="pay-btn" @click="goPay">去结算</div>
      </div>
    </div>
    <transition name="fold">
      <div class="cart-list"  v-transfer-dom v-show="cartModal">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="product" v-for="(product,index) in selectProducts" :key="index">
              <span class="name">{{product.name}}</span>
              <span class="specText">{{product.specText}}</span>
              <div class="price">
                <span>￥{{product.payPrice*product.count}}</span>
              </div>
              <div class="count">
                <x-icon type="ios-minus-outline" size="25" @click.native.stop="minus(index)"></x-icon>
                <span class="num">{{product.count}}</span>
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
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      //清空的时候是否要隐藏购物车
      clearable: {
        type: Boolean,
        default: false
      },
      products: {
        type: Array,
        default: () => {
          return [];
        }
      },
      deliveryFee: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        visible: this.value,
        cartModal: false,
        scroll: null,
        selectProducts: this.products
      }
    },
    computed: {
      totalCount() {
        let sum = (this.selectProducts.length === 0 ? 0 : this.selectProducts.reduce((total, e) => {
          return total + e.count;
        }, 0));
        return sum;
      },
      totalPrice() {
        let sum = 0;
        this.selectProducts.forEach(e => {
          sum += e.count * e.payPrice;
        });
        return sum;
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
      }
    },
    methods: {
      goPay() {
        this.$emit('go-pay');
      },
      empty() {
        if (this.clearable) {
          this.visible = false;
          this.$emit('input', false);
        }
        this.selectProducts = [];
        this.changeSelectedProducts();
      },
      minus(index) {
        this.selectProducts[index].count > 0 && this.selectProducts[index].count--;
        if(this.selectProducts[index].count===0){
          this.selectProducts.splice(index,1);
        }
        this.changeSelectedProducts();
      },
      add(index) {
        this.selectProducts[index].count < 999 && this.selectProducts[index].count++;
        this.changeSelectedProducts();
      },
      changeSelectedProducts() {
        this.$emit('on-change', this.selectProducts);
      },
      updateScroll() {
        this.$nextTick(()=>{
          if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
              click: true,
            });
          } else {
            this.scroll.scrollTo(0, 0, 500);
            this.scroll.refresh();
          }
          console.log(this.scroll);
        });
      },
      toggleCartModal() {
        this.cartModal = !this.cartModal;
      }
    }
  } 
</script>

<style lang="less" src="./ShopCart.less" scoped>
</style>
