<style lang="less" scoped src="./AddAddress.less"></style>
<template>
    <div id="add-address">
        <group label-width="4.5rem" label-margin-right="2em" label-align="left">
            <x-input title="联系人" placeholder="必填" v-model="contacts"></x-input>
            <x-input title="手机号" placeholder="请填写收货人的手机号码" v-model="phone"></x-input>
            <x-input title="收获地址" placeholder="例：TIT创意园" v-model="address"></x-input>
            <x-input title="门牌号" placeholder="例：16号楼3层501" v-model="doorNumber"></x-input>
            <div class="btn-wrapper">
            <x-button type="primary">保存地址</x-button>
            </div>
        </group>
    </div>
</template>
<script>
import { Group, XInput, XButton } from 'vux';
export default {
	components: {
		Group,
		XInput,
		XButton,
	},
	data() {
		return {
			from: {
				contacts: '',
				phone: '',
				address: '',
				doorNumber: '',
			},
		};
	},
};
</script>

