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
import {XInput } from 'vux';
import {addAddress} from '@/services/getData.js';
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
	methods:{
		saveAddress(){
			let openId=this.$store.state.openId;
			let params=Object.assign(this.form,{openId:openId});
			addAddress(params).then(res=>{
				this.$router.back();
			});
		}
	}
};
</script>

