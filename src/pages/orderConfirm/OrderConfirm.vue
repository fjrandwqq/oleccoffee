<style lang="less" scoped src="./OrderConfirm.less"></style>
<template>
	<div id="order-confirm">
		<div class="content-wrapper">
			<div class="delivery-group clearfix">
				<div class="btn left-btn" :class="{active:form.receiveType=='送货上门'}" @click="form.receiveType='送货上门';deliveryFee=0">
					<div class="btn-inner">外卖配送</div>
				</div>
				<div class="btn right-btn" :class="{active:form.receiveType=='自提'}" @click="form.receiveType='自提';deliveryFee=0">
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
				<cell class="pay-way" title="支付方式" value="微信支付"></cell>
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
import { getUserAddressList, updateAddress, createOrder, unifiedOrder } from '@/services/getData';
import { IMG_PATH } from '@/config';
import { fixPrice, deepCopy } from '@/services/utils';
const scrollOption = {
	click: true,
	tap: true,
	stopPropagation: true,
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
			deliveryFee: 0,
			IMG_PATH,
			shopInfo: {},
			showTimePopup: false,
			addressPopup: false,
			editAddressPopup: false,
			editAddress: {},
			addressList: [],
			editAddressIndex: 0,
			selectAddressIndex: 0,
			firstGetList: true,
			ordersGoods: [],
			orderInfo: {
				totalPrice: 0,
				discount: 0,
			},
			servedTime: new Date().Format('hh:mm'),
			form: {
				ordersGoods: [],
				receiveType: '送货上门',
				userAddressId: '',
				payForm: '微信支付',
				shopId: '',
				openId: '',
				expectedReceiveDateTime: '',
			},
		};
	},
	watch: {
		showTimePopup(val) {
			this.toggleScroll(val);
		},
		addressPopup(val) {
			this.toggleScroll(val);
		},
		editAddressPopup(val) {
			this.toggleScroll(val);
		},
	},
	created() {
		this.ordersGoods = this.$route.params.orderGoods || this.ordersGoods;
		this.shopInfo = this.$store.state.shopInfo || {};
		this.form.shopId = this.shopInfo.id;
		this.orderInfo = {
			totalPrice: fixPrice(this.ordersGoods.reduce((total, i) => i.totalPrice + total, 0) + this.deliveryFee),
			discount: this.ordersGoods[0].discount,
		};
		this.getAddressList();
	},
	activated() {
		this.ordersGoods = this.$route.params.orderGoods || this.ordersGoods;
		this.shopInfo = this.$store.state.shopInfo || {};
		this.form.shopId = this.shopInfo.id;
		this.orderInfo = {
			totalPrice: fixPrice(this.ordersGoods.reduce((total, i) => i.totalPrice + total, 0) + this.deliveryFee),
			discount: this.ordersGoods[0].discount,
		};
		// this.getAddressList();
		if (this.orderScroll) {
			this.orderScroll.refresh();
			this.orderScroll.scrollTo(0, 0, 500);
		}
		this.getAddressList();
	},
	methods: {
		toggleScroll(val) {
			val ? this.orderScroll.disable() : this.orderScroll.enable();
		},
		goPay() {
			if (this.form.receiveType==='送货上门'&&this.addressList.length === 0) {
				this.$vux.toast.show({ type: 'warn', text: '请填写地址' });
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
					specList: e.specList,
				});
			});
			createOrder(this.form)
				.then(res => {
					let goods_detail = [];
					this.ordersGoods.forEach(e => {
						goods_detail.push({
							goods_id: e.goodsId,
							goods_name: e.goodsName,
							quantity: e.goodsNum,
							price: e.price,
						});
					});
					const params = {
						openId: this.$store.state.openId,
						bizTradeNo: res.code,
						appCode: 'publicPlatform',
						goodsName: '欧蕾克外卖订单', //简单商品描述，如欧蕾克外卖订单？
						goodsDetail: JSON.stringify(goods_detail), //jsonString，格式如上
						totalFee: this.orderInfo.totalPrice + '',
					};
					// 显示
					// this.$vux.alert.show({
					// 	title: '收-订单号-发',
					// 	content: res.code + '收-订单号-发' + params.bizTradeNo,
					// });
					unifiedOrder(params)
						.then(result => {
							// this.$wechat.ready(() => {
							// 	this.$wechat.chooseWXPay({
							// 		timestamp: result.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
							// 		nonceStr: result.nonceStr, // 支付签名随机串，不长于 32 位
							// 		package: 'prepay_id='+result.prepayId, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
							// 		signType: result.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
							// 		paySign: result.paySign, // 支付签名
							// 		success: function(payRes) {
							// 			// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
							// 			if (res.err_msg == 'get_brand_wcpay_request：ok') {
							// 				this.$router.push('/homePage');
							// 			}
							// 			else{
							// 				this.$vux.toast.show({ type: 'warn', text: '支付失败,请重新下单' });
							// 				this.$router.push('/homePage');
							// 			}
							// 		},
							// 		cancel: function(payRes) {
							// 			this.$vux.toast.show({ type: 'warn', text: '支付失败,请重新下单' });
							// 			this.$router.push('/homePage');
							// 		},
							// 	});
							// });
							this.weixinPay(result);
						})
						.catch(res => {
							this.$vux.toast.show({ type: 'warn', text: '支付失败,请重新下单' });
						});
				})
				.catch(e => {
					this.$vux.toast.show({ type: 'warn', text: '支付失败,请重新下单1' });
					// this.$router.push('/homePage');
				});
		},
		weixinPay(data) {
			var vm = this;
			if (typeof WeixinJSBridge == 'undefined') {
				//微信浏览器内置对象。参考微信官方文档
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(data), false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(data));
					document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(data));
				}
			} else {
				vm.onBridgeReady(data);
			}
		},
		/**
		 * @method 支付费用方法
		 * @param data:后台返回的支付对象,(详情微信公众号支付API中H5提交支付);
		 */
		onBridgeReady(data) {
			var vm = this;
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest',
				{
					appId: data.appId, //公众号名称，由商户传入
					timeStamp: data.timeStamp, //时间戳，自1970年以来的秒数
					nonceStr: data.nonceStr, //随机串
					package: data.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
					signType: data.signType, //微信签名方式：
					paySign: data.paySign, //微信签名
				},
				function(res) {
						vm.$vux.toast.show({ type: 'warn', text:res.err_msg  });
					// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
					if (res.err_msg == 'get_brand_wcpay_request：ok') {
						vm.$vux.toast.show({ text: '成功' });
						vm.$router.push('/homePage');
					} else {
						vm.$vux.toast.show({ type: 'warn', text: '支付失败,请重新下单' });
						vm.$router.push('/homePage');
					}
				}
			);
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
				this.$router.push('addAddress');
			}
		},
		getAddressList() {
			const openId = this.$store.state.openId;
			openId &&
				getUserAddressList(openId).then(res => {
					this.addressList = res || [];
					if (this.addressList.length) {
						this.selectAddressIndex = 0;
					}
				});
		},
		showEditPopup(index) {
			this.editAddressIndex = index;
			this.addressPopup = false;
			this.editAddressPopup = true;
			this.editAddress = deepCopy(this.addressList[index]);
		},
		saveAddress() {
			const params = {
				id: this.editAddress.id,
				name: this.editAddress.name,
				mobile: this.editAddress.mobile,
				address: this.editAddress.address,
				houseNum: this.editAddress.houseNum,
			};
			updateAddress(params).then(res => {
				this.$set(this.addressList, this.editAddressIndex, res);
				this.editAddressPopup = false;
			});
		},
		clickAddress(index) {
			this.selectAddressIndex = index;
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.orderScroll = new BScroll('#order-confirm', scrollOption);
		});
	},
};
</script>
<style lang="less" scoped src="./OrderConfirm.less"></style>



