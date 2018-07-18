<style lang="less" scoped src="./OrderConfirm.less"></style>
<template>
    <div id="order-confirm">
        <div class="content-wrapper">
            <div class="delivery-group clearfix">
                <div class="btn left-btn" :class="{active:order.takingWay==0}" @click="order.takingWay=0">
                    <div class="btn-inner">外卖配送</div>
                </div>
                <div class="btn right-btn" :class="{active:order.takingWay==1}" @click="order.takingWay=1">
                    <div class="btn-inner">到店自提</div>
                </div>
            </div>
            <group v-show="!order.takingWay" class="buyer-info">
                <cell-box class="address-wrapper" is-link @click.native="showAddressPopup">
                    <div class="pr15">
                        <p>白马岗小区11栋1梯7021111111111111111111111111</p>
                        <p>菊花战斗士 15218046490</p>
                    </div>
                </cell-box>
                <cell title="送达时间" :value="'大约'+order.servedTime+ '送达'" is-link @click.native="showTimePopup = true"></cell>
            </group>
            <group v-show="order.takingWay" class="seller-info">
                <cell-box class="address-wrapper">
                    <p>广州市天河区景明街1号前座07店铺</p>
                </cell-box>
                <cell title="自取时间" :value="order.servedTime" is-link @click.native="showTimePopup = true"></cell>
            </group>
            <group class="goods-info">
                <cell-box align-items="flex-start">
                    <div class="product-info">
                        <div class="img" :style="{backgroundImage:'url('+order.imgSrc+')'}"></div>
                        <div class="text-wrapper">
                            <span>招牌卡布奇诺的</span>
                            <p>无糖阿萨</p>
                            <p>x1</p>
                        </div>
                    </div>
                    <div class="price">
                        <span class="symbol">￥</span>29
                    </div>
                </cell-box>
                <cell-box v-if="order.discount" class="extra-info">
                    <div class="extra-left">
                        <p class="mb20">
                            <span class="discount">折</span>
                            <span> 活动打{{order.discount*10}}折</span>
                        </p>
                        <span>配送费</span>
                    </div>
                    <div class="extra-right">
                        <div class="red mb20"><span class="symbol">-￥</span>5.8</div>
                        <div class="price"><span class="symbol">￥</span>5</div>
                    </div>
                </cell-box>
                <cell-box class="sum">
                    <p>
                        小计
                        <span class="symbol">￥</span>
                        <span class="total">{{order.total}}</span>
                    </p>
                </cell-box>
            </group>
            <group class="pay-way">
                <cell title="支付方式" value="微信支付"></cell>
            </group>
        </div>
        <div class="footer-bar">
            <div class="total-price">
                合计
                <span class="symbol">￥</span>
                <span class="total">{{order.total}}</span>
            </div>
            <div class="pay-btn" @click="goPay">去支付</div>
        </div>
        <popup class="address-popup" :hide-on-blur="false" height="255px" v-model="addressPopup" is-transparent>
            <div style="background-color:#fff;">
                <div class="address-header">
                    <div class="header-left" @click="addressPopup = false">取消</div>
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
                    <span class="plus">+</span>
                    <span>新增收货地址</span>
                </div>
            </div>
        </popup>
        <popup :ref="editAddressPopup" class="edit-address-popup" :hide-on-blur="false" v-model="editAddressPopup" is-transparent>
            <div style="background-color:#fff;">
                <group label-width="4.5rem" label-margin-right="2em" label-align="left">
                    <div class="address-header">
                        <div class="header-left" @click="editAddressPopup=false">取消</div>
                        <div class="header-title">选择收货地址</div>
                    </div>
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
        <popup v-model="showTimePopup">
            <datetime-view v-model="order.servedTime" format="HH:mm"></datetime-view>
        </popup>
    </div>
</template>
<script>
import { Popup, DatetimeView, XInput, XHeader } from 'vux';
import BScroll from 'better-scroll';
const scrollOption = {
    click: true,
    tap: true,
};
export default {
    components: {
        Popup,
        DatetimeView,
        XInput,
        XHeader,
    },
    data() {
        return {
            showTimePopup: false,
            addressPopup: false,
            editAddressPopup: false,
            editAddress: {},
            order: {
                takingWay: 0,
                total: 10,
                servedTime: '14:37',
                discount: 0.8,
                imgSrc: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
                realTotal: 20,
            },
            addressList: [],
        };
    },
    methods: {
        goPay() { },
        openAddAddressPage() {
            this.$nextTick(() => {
                this.$router.push('addAddress');
            });
        },
        showAddressPopup() {
            this.addressList = [
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
                {
                    address: '广东深圳龙岗区扬马小区振兴楼',
                    contacts: '骑单车的小员工',
                    phone: '15647891122',
                    doorNumber: '12313123',
                },
            ];
            this.addressPopup = true;
            this.$nextTick(() => {
                new BScroll('.address-popup', scrollOption);
            });
        },
        showEditPopup(index) {
            this.addressPopup = false;
            this.editAddressPopup = true;
            this.editAddress = this.addressList[index];
            this.$nextTick(() => {
                new BScroll(this.$refs.editAddressPopup, scrollOption);
            });
        },
    },
    mounted() {
        this.$nextTick(() => {
            new BScroll('#order-confirm',scrollOption);
        });
    }
};
</script>
<style lang="less" scoped src="./OrderConfirm.less"></style>



