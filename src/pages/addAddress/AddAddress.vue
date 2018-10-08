<style lang="less" scoped src="./AddAddress.less"></style>
<template>
	<div id="add-address">
		<group gutter="0">
			<x-input title="联系人" placeholder="必填" v-model="form.name"></x-input>
			<x-input title="手机号" placeholder="请填写收货人的手机号码" v-model="form.mobile"></x-input>
			<x-input title="收货地址" placeholder="例：TIT创意园" v-model="form.address"></x-input>
			<x-input title="门牌号" placeholder="例：16号楼3层501" v-model="form.houseNum"></x-input>
		</group>
		<div class="btn-wrapper">
			<x-button type="primary" @click.native="saveAddress">保存地址</x-button>
		</div>
	</div>
</template>
<script>
import { XInput } from 'vux';
import { addAddress } from '@/services/getData.js';
export default {
	components: {
		XInput,
	},
	data() {
		return {
			form: {
				name: '',
				mobile: '',
				address: '',
				houseNum: ''
			},
		};
	},
	activated() {
		this.form = {
			name: '',
			mobile: '',
			address: '',
			houseNum: ''
		}
	},
	methods: {
		saveAddress() {
			if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test(this.form.mobile)) return this.$vux.toast.text('请填写正确手机号')
			addAddress(Object.assign(this.form, { openId: this.$store.state.openId })).then(res => {
				this.$vux.toast.show({
					text: '新增收货地址成功',
					onHide: () => this.$router.back()
				})
			}).catch(e => this.$vux.toast.text('新增收货地址失败'));
		}
	}
};
</script>

