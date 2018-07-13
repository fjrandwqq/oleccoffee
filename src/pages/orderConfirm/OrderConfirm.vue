<style lang="less" scoped src="./OrderConfirm.less"></style>
<template>
    <div id="order-confirm">
        <div class="taking-way">

        </div>
        <group v-if="order.takingWay==0" class="buyer-info">
            <cell-box class="address-wrapper" is-link @click.native="showAddressPopup=true">
                <div>
                    <p>白马岗小区11栋1梯7021111111111111111111111111</p>
                    <p>菊花战斗士 15218046490</p>
                </div>
            </cell-box>
            <cell-box class="time-wrapper" is-link @click.native="showTimePopup = true">
                <p>送达时间</p>
                <p>大约 {{order.servedTime}} 送达</p>
            </cell-box>
        </group>
        <group v-else class="seller-info">
            <cell-box class="address-wrapper">
                <div>
                    <p>广州市天河区景明街1号前座07店铺</p>
                </div>
            </cell-box>
            <cell-box class="time-wrapper" is-link @click.native="showTimePopup = true">
                <p>自取时间</p>
                <p>{{order.servedTime}}</p>
            </cell-box>
        </group>
        <group class="goods-info">
            <cell-box>
                <div class="flex-item left-info">
                    <img :src="order.imgSrc" />
                    <div class="text-wrapper">
                        <p>招牌卡布奇诺</p>
                        <p>无糖</p>
                        <p>x1</p>
                    </div>
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
        <div v-transfer-dom>
            <popup class="address-popup" v-model="showAddressPopup" height="270px" is-transparent>
                <div style="background-color:#fff;margin:0 auto;border-radius:5px;">
                    <div class="header">
                        <div class="header-left">取消</div>
                        <div class="header-title">选择收货地址</div>
                    </div>
                    <div class="body" v-for="(item,index) in addressList" :key="index">
                        <div class="radio">
                            <img src="../../images/check.png" />
                        </div>
                        <div class="content">
                            <p>{{item.address}}{{item.doorNumber}}</p>
                            <p>{{item.contacts}} {{item.phone}}</p>
                        </div>
                        <div class="btn">
                            <img src="../../images/edit.png" @click="showEditPopup(index)" />
                        </div>
                    </div>
                    <div class="footer" @click="openAddAddressPage">
                        <img src="../../images/add.png">
                        <span>新增收货地址</span>
                    </div>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup class="edit-address-popup" v-model="showEditAddressPopup" height="270px" is-transparent>
                <div style="background-color:#fff;margin:0 auto;border-radius:5px;">
                    <group label-width="4.5rem" label-margin-right="2em" label-align="left">
                        <x-header class="header" :left-options="{showBack: false}">选择收获地址</x-header> 
                        <x-input title="联系人" placeholder="必填" v-model="editAddress.contacts"></x-input>
                        <x-input title="手机号" placeholder="请填写收货人的手机号码" v-model="editAddress.phone"></x-input>
                        <x-input title="收获地址" placeholder="例：TIT创意园" v-model="editAddress.address"></x-input>
                        <x-input title="门牌号" placeholder="例：16号楼3层501" v-model="editAddress.doorNumber"></x-input>
                        <div class="btn-wrapper">
                            <x-button type="primary">保存地址</x-button>
                        </div>
                    </group>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showTimePopup">
                <datetime-view v-model="order.servedTime" format="HH:mm"></datetime-view>
            </popup>
        </div>

    </div>
</template>
<script>
import { Group, CellBox, Popup, DatetimeView, XInput, XButton,XHeader, TransferDom } from 'vux';
export default {
	components: {
		Group,
		CellBox,
		Popup,
		DatetimeView,
		XInput,
		XButton,
        XHeader
	},
	directives: {
		TransferDom,
	},
	data() {
		return {
			showTimePopup: false,
			showAddressPopup: false,
			showEditAddressPopup: false,
			editAddress: {},
			order: {
				takingWay: 0,
				total: 10,
				servedTime: '14:37',
				discount: 0.8,
				imgSrc: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
				realTotal: 20,
			},
			addressList: [
				{
					address: '广东深圳龙岗区扬马小区振兴楼',
					contacts: '骑单车的小员工',
					phone: '15647891122',
					doorNumber: '12313123',
				},
				{
					address: '广东深圳龙岗区扬马小区振兴楼',
					contacts: '骑单车的小员工',
					phone: '15647891122',
					doorNumber: '12313123',
				},
				{
					address: '广东深圳龙岗区扬马小区振兴楼',
					contacts: '骑单车的小员工',
					phone: '15647891122',
					doorNumber: '12313123',
				},
			],
		};
	},
	methods: {
		goPay() {},
		openAddAddressPage() {
			this.$nextTick(() => {
				this.$router.push('addAddress');
			});
		},
		showEditPopup(index) {
			this.showAddressPopup = false;
			this.showEditAddressPopup = true;
			this.editAddress = this.addressList[index];
		},
	},
};
</script>
<style lang="less" scoped src="./OrderConfirm.less"></style>



