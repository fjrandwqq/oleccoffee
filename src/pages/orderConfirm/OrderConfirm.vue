<style lang="less" scoped src="./OrderConfirm.less"></style>
<template>
    <div id="order-confirm">
        <div class="taking-way"></div>
        <div v-if="takingWay==0" class="buyer-info">
            <div>
            </div>
            
        </div>
        <div v-if="takingWay==1" class="seller-info">

        </div>
        <div class="goods-info">

        </div>
        <div class="payForm">
        </div>
        <div class="footer-bar">
            <div class="total-price">
                <span>合计￥</span>
                <span class="total">{{total}}</span>
            </div>
            <div class="pay-btn" @click="goPay">去支付</div>
        </div>
    </div>
</template>
<script>
export default {
	data() {
		return {
			takingWay: '',
			total: 10,
		};
	},
};
</script>
<style lang="less" scoped src="./OrderConfirm.less"></style>



