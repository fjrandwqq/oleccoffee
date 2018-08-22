<!--
Description 购物车组件
@authors fanjiongrong (fanjiongrong@tvflnet.com)
@date    2018-08-22 17:14:40
@version 1.0.0
-->
<template>
  <div>
    <div class="cart-wrapper">
      <span class="cart-pic" @click.native="cartModalShow=true">
        <img src="../../images/cart.png" />
        <badge text="8"></badge>
      </span>
      <div class="pay-btn" @click="goPay">去结算</div>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="less" src="./ShopCart.less" scoped>
</style>
