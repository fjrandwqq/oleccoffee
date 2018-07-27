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
                        <p>{{selectAddress.address}}</p>
                        <p>{{selectAddress.name}} {{selectAddress.mobile}}</p>
                    </div>
                </cell-box>
                <cell title="送达时间" :value="'大约'+order.servedTime+ '送达'" is-link @click.native="showTimePopup = true"></cell>
            </group>
            <group v-show="form.receiveType=='自提'" class="seller-info">
                <cell-box class="address-wrapper">
                    <p>{{shopInfo.address}}</p>
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
                        <div class="red mb20">
                            <span class="symbol">-￥</span>5.8</div>
                        <div class="price">
                            <span class="symbol">￥</span>5</div>
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
        <popup class="address-popup" :hide-on-blur="false" height="255px" v-model="addressPopup">
            <div class="address-header">
                选择收货地址
                <div class="header-left" @click="addressPopup = false">取消</div>
            </div>
            <div class="address-body">
                <div>
                    <div class="address" v-for="(item,index) in addressList" :key="index">
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
            <datetime-view v-model="order.servedTime" format="HH:mm"></datetime-view>
        </popup>
    </div>
</template>
<script>
    import { Popup, DatetimeView, XInput, XHeader } from 'vux';
    import BScroll from 'better-scroll';
    import { getUserAddressList,updateAddress,createOrder} from '@/services/getData';
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
            XHeader,
        },
        data() {
            return {
                shopInfo: {},
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
                editAddressIndex:0,
                selectAddress:{},
                firstGetList:false,
                form:{
                    receiveType:'送货上门',
                    userAddressId:'',
                    payForm:'微信支付',
                    shopId:'',
                    openId:'',
                    expectedReceiveDateTime:'',
                    ordersGoods:[{
                        goodsId:'',
                        goodsName:'',
                        specList:{
                            name:'',
                            type:''
                        }
                    }]
                }
            };
        },
        created() {
            let shopInfo = this.$store.state.shopInfo;
            shopInfo && (this.shopInfo = shopInfo);
            this.form.shopId=shopInfo.shopId;
            this.getAddressList();

            let ordersGoods=this.$route.params.orderGoods;
            console.log(ordersGoods);
        },
        methods: {
            goPay() {

            },
            openAddAddressPage() {
                this.addressPopup = false;
                this.$nextTick(() => {
                    this.$router.push('addAddress');
                });
            },
            showAddressPopup() {
                this.getAddressList();
                this.addressPopup = true;
                this.$nextTick(() => {
                    new BScroll('.address-body', scrollOption);
                });
            },
            getAddressList() {
                let openId = this.$store.state.openId;
                getUserAddressList(openId).then(res => {
                    this.addressList = res || [];
                    if(this.firstGetList&&this.addressList.length>0){
                        this.selectAddress=this.addressList[0];
                        this.firstGetList=false;
                    }
                    console.log(this.addressList);
                });
            },
            showEditPopup(index) {
                this.editAddressIndex=index;
                this.addressPopup = false;
                this.editAddressPopup = true;
                this.editAddress = this.addressList[index];
            },
            saveAddress(){
                updateAddress(this.editAddress).then(res=>{
                    this.$set(this.addressList,index,res);
                });
            }
        },
        mounted() {
            this.$nextTick(() => {
                new BScroll('#order-confirm', scrollOption);
            });
        }
    };
</script>
<style lang="less" scoped src="./OrderConfirm.less"></style>



