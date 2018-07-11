<style lang="less" scoped src="./OrderConfirm.less"></style>
<template>
    <div id="order-confirm">
        <div class="taking-way">

        </div>
        <group v-if="order.takingWay==0" class="buyer-info">
            <cell-box class="address-wrapper" is-link @click.native="showAddressModal">
                <div>
                    <p>白马岗小区11栋1梯7021111111111111111111111111</p>
                    <p>菊花战斗士 15218046490</p>
                </div>
            </cell-box>
            <cell-box class="time-wrapper" is-link @click.native="showTimeModal">
                <p>送达时间</p>
                <p>大约 {{order.servedTime}} 送达</p>
            </cell-box>
        </group>
        <group v-else class="seller-info">
            <cell-box class="address-wrapper" @click.native="showAddressModal">
                <div>
                    <p>广州市天河区景明街1号前座07店铺</p>
                </div>
            </cell-box>
            <cell-box class="time-wrapper" is-link @click.native="showTimeModal">
                <p>自取时间</p>
                <p>{{order.servedTime}}</p>
            </cell-box>
        </group>
        <group class="goods-info">
            <cell-box>
                <div class="flex-item left-info">
                    <img :src="order.imgSrc" />
                </div>
                <div class="price">
                    ￥29
                </div>
            </cell-box>
            <cell-box v-if="order.discount">
                <div class="flex-item">活动打{{order.discount*10}}折</div>
                <div>￥5.8</div>
            </cell-box>
            <cell-box>
                <div class="flex-item">配送费</div>
                <div>￥5</div>
            </cell-box>
            <cell-box class="total">
                ￥{{order.realTotal}}
            </cell-box>
        </group>
        <group class="pay-form">
            <cell-box>
                <p>支付方式</p>
                <p>微信支付</p>
            </cell-box>
        </group>
        <div class="footer-bar">
            <div class="total-price">
                <span>合计￥</span>
                <span class="total">{{order.total}}</span>
            </div>
            <div class="pay-btn" @click="goPay">去支付</div>
        </div>
    </div>
</template>
<script>
import { Group, CellBox } from 'vux';
export default {
	components: {
		Group,
		CellBox,
	},
	data() {
		return {
			order: {
				takingWay: 0,
				total: 10,
				servedTime: '14:37',
				discount: 0.8,
				imgSrc: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
                realTotal:20
            },
		};
	},
	methods: {
		showAddressModal() {
			alert('11');
		},
		showTimeModal() {},
	},
};
</script>
<style lang="less" scoped src="./OrderConfirm.less"></style>



