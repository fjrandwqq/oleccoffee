<style lang="less" scoped src="./OrderConfirm.less"></style>
<template>
    <div id="order-confirm">
        <div class="content-wrapper">
            <div class="delivery-group clearfix">
                <div class="btn left-btn" :class="{active:form.receiveType=='送货上门'}" @click="form.receiveType='送货上门'">
                    <div class="btn-inner">外卖配送</div>
                </div>
                <div class="btn right-btn" :class="{active:form.receiveType=='自提'}" @click="form.receiveType='自提'">
                    <div class="btn-inner">到店自提</div>
                </div>
            </div>
            <group v-show="form.receiveType=='送货上门'" class="buyer-info">
                <cell-box class="address-wrapper" is-link @click.native="showAddressPopup">
                    <div class="pr15">
                        <!-- <p>{{selectAddress.address || '请填写收货地址'}}</p>
                        <p>{{selectAddress.name}} {{selectAddress.mobile}}</p> -->
                        <p>{{(addressList.length>0&&addressList[selectAddressIndex].address)|| '请填写收货地址'}}</p>
                        <template v-if="addressList.length>0">
                            <p>{{addressList[selectAddressIndex].name||''}} {{addressList[selectAddressIndex].mobile||''}}</p>
                        </template>
                    </div>
                </cell-box>
                <cell title="送达时间" :value="'大约'+servedTime+ '送达'" is-link @click.native="showTimePopup = true"></cell>
            </group>
            <group v-show="form.receiveType=='自提'" class="seller-info">
                <cell-box class="address-wrapper">
                    <p>{{shopInfo.address}}</p>
                </cell-box>
                <cell title="自取时间" :value="servedTime" is-link @click.native="showTimePopup = true"></cell>
            </group>
            <group class="goods-info">
                <cell-box align-items="flex-start" v-for="(goods,index) in ordersGoods" :key="index">
                    <div class="product-info">
                        <div class="img" :style="{backgroundImage:'url('+IMG_PATH+goods.imgs.split(',')[0]+')'}"></div>
                        <div class="text-wrapper">
                            <span>{{goods.goodsName}}</span>
                            <p>{{goods.specListText}}</p>
                            <p>x{{goods.goodsNum}}</p>
                        </div>
                    </div>
                    <div class="price">
                        <span class="symbol">￥</span>{{goods.totalPrice}}
                    </div>
                </cell-box>
                <cell-box class="extra-info">
                    <div class="extra-left">
                        <p class="mb20" v-show="orderInfo.discount">
                            <span class="discount">折</span>
                            <span> 活动打{{orderInfo.discount*10}}折</span>
                        </p>
                        <span>配送费</span>
                    </div>
                    <div class="extra-right">
                        <div class="red mb20" v-show="orderInfo.discount">
                            <span class="symbol">-￥</span>5.8</div>
                        <div class="price">
                            <span class="symbol">￥</span>{{deliveryFee}}</div>
                    </div>
                </cell-box>
                <cell-box class="sum">
                    <p>
                        小计
                        <span class="symbol">￥</span>
                        <span class="total">{{orderInfo.totalPrice}}</span>
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
                <span class="total">{{orderInfo.totalPrice}}</span>
            </div>
            <div class="pay-btn" @click="goPay">去支付</div>
        </div>
        <popup class="address-popup" :hide-on-blur="false" height="255px" v-model="addressPopup">
            <div class="address-header">
                选择收货地址
                <div class="header-left" @click="addressPopup = false">取消</div>
            </div>
            <div class="address-body">
                <div>
                    <div class="address" v-for="(item,index) in addressList" @click="clickAddress(index)" :key="index">
                        <x-icon type="ios-checkmark" size="20"></x-icon>
                        <div class="content">
                            <p>{{item.address}}{{item.houseNum}}</p>
                            <p>{{item.name}} {{item.mobile}}</p>
                        </div>
                        <img width="18" src="@/images/edit.png" @click="showEditPopup(index)" />
                    </div>
                </div>
            </div>
            <div class="footer" @click="openAddAddressPage">
                <x-icon type="ios-plus-outline" size="18"></x-icon>
                <span>新增收货地址</span>
            </div>
        </popup>
        <popup class="edit-address-popup" height="310px" :hide-on-blur="false" v-model="editAddressPopup">
            <div class="address-header">
                <div class="header-left" @click="editAddressPopup=false">取消</div>
                <div class="header-title">编辑收货地址</div>
            </div>
            <group gutter="0">
                <x-input title="联系人" placeholder="必填" v-model="editAddress.name"></x-input>
                <x-input title="手机号" placeholder="请填写收货人的手机号码" v-model="editAddress.mobile"></x-input>
                <x-input title="收货地址" placeholder="例：TIT创意园" v-model="editAddress.address"></x-input>
                <x-input title="门牌号" placeholder="例：16号楼3层501" v-model="editAddress.houseNum"></x-input>
            </group>

            <div class="btn-wrapper">
                <x-button type="primary" @click.native="saveAddress">保存地址</x-button>
            </div>
        </popup>
        <popup v-model="showTimePopup">
            <datetime-view v-model="servedTime" format="HH:mm"></datetime-view>
        </popup>
    </div>
</template>
<script>
import { Popup, DatetimeView, XInput } from 'vux';
import BScroll from 'better-scroll';
import { getUserAddressList, updateAddress, createOrder } from '@/services/getData';
import { IMG_PATH } from '@/config';
import { fixPrice,deepCopy} from '@/services/utils';
const scrollOption = {
    click: true,
    tap: true,
    stopPropagation: true
};
export default {
    components: {
        Popup,
        DatetimeView,
        XInput,
    },
    data() {
        return {
            orderScroll: null,
            deliveryFee: 5,
            IMG_PATH,
            shopInfo: {},
            showTimePopup: false,
            addressPopup: false,
            editAddressPopup: false,
            editAddress: {},
            addressList: [],
            editAddressIndex: 0,
            selectAddressIndex:0,
            firstGetList: true,
            ordersGoods: [],
            orderInfo: {
                totalPrice: 0,
                discount: 0
            },
            servedTime: new Date().Format('hh:mm'),
            form: {
                ordersGoods: [],
                receiveType: '送货上门',
                userAddressId: '',
                payForm: '微信支付',
                shopId: '',
                openId: '',
                expectedReceiveDateTime: ''
            }
        };
    },
    watch: {
        showTimePopup(val) {
            this.toggleScroll(val)
        },
        addressPopup(val) {
            this.toggleScroll(val)
        },
        editAddressPopup(val) {
            this.toggleScroll(val)
        },
    },
    created() {
        this.ordersGoods = this.$route.params.orderGoods || [];
        this.shopInfo = this.$store.state.shopInfo || {};
        this.form.shopId = this.shopInfo.id;
        this.orderInfo = {
            totalPrice: fixPrice(this.ordersGoods.reduce((total, i) => i.totalPrice + total, 0) + this.deliveryFee),
            discount: this.ordersGoods[0].discount
        }
        this.getAddressList();
    },
    activated(){
        if(this.orderScroll){
            this.orderScroll.refresh();
            this.orderScroll.scrollTo(0,0,500);
        }
        this.getAddressList();
    },
    methods: {
        toggleScroll(val) {
            val ? this.orderScroll.disable() : this.orderScroll.enable()
        },
        goPay() {
            if(this.addressList.length === 0){
                this.$vux.toast.show({type:'warn',text:'请填写地址'});
                return; 
            }
            let date = new Date();
            this.form.expectedReceiveDateTime = date.Format('yyyy-MM-dd') + ' ' + this.servedTime + ':00';
            this.form.userAddressId = this.addressList[this.selectAddressIndex].id;
            this.form.openId = this.$store.state.openId;
            this.ordersGoods.forEach(e => {
                this.form.ordersGoods.push({
                    goodsId: e.goodsId,
                    goodsName: e.goodsName,
                    goodsNum: e.goodsNum,
                    specList: e.specList
                });
            });
            createOrder(this.form).then(res => {
                console.log(res);
                this.$vux.toast.text('下单成功')
            }).catch(e => this.$vux.toast.text('下单失败'))

        },
        openAddAddressPage() {
            this.addressPopup = false;
            this.$nextTick(() => {
                this.$router.push('addAddress');
            });
        },
        showAddressPopup() {
            if (this.addressList.length) {
                this.addressPopup = true;
                if (this.firstGetList) {
                    this.firstGetList = false;
                    this.$nextTick(() => {
                        new BScroll('.address-body', scrollOption);
                    });
                }
            } else {
                this.$router.push('addAddress')
            }

        },
        getAddressList() {
            const openId = this.$store.state.openId;
            openId && getUserAddressList(openId).then(res => {
                this.addressList = res || [];
                if (this.addressList.length) {
                    this.selectAddressIndex=0;
                }
                console.log(this.addressList);
            });
        },
        showEditPopup(index) {
            this.editAddressIndex = index;
            this.addressPopup = false;
            this.editAddressPopup = true;
            this.editAddress = deepCopy(this.addressList[index]);
            console.log('this.editAddress');
            console.log(this.editAddress);
        },
        saveAddress() {
            const params = {
                id: this.editAddress.id,
                name: this.editAddress.name,
                mobile: this.editAddress.mobile,
                address: this.editAddress.address,
                houseNum: this.editAddress.houseNum
            };
            updateAddress(params).then(res => {
                this.$set(this.addressList, this.editAddressIndex, res);
                this.editAddressPopup=false;
            });
        },
        clickAddress(index) {
            this.selectAddressIndex=index;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.orderScroll = new BScroll('#order-confirm', scrollOption);
        });
    }
};
</script>
<style lang="less" scoped src="./OrderConfirm.less"></style>



