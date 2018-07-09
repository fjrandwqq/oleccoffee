<!--
Description
@authors Your Name (you@example.org)
@date    2018-07-06 20:13:34
@version 1.0.0
-->
<style lang="less" scoped src="./PersonalHome.less"></style>
<template>
    <div id="personal">
        <view-box style="height:100%;" ref="viewBox">
            <div class="person-info-wrapper clearfix">
                <div class="person-info-real">
                    <div class="avator">
                        <img src="../../images/personal/avator.png">
                    </div>
                    <div class="text-info ml20">
                        <p class="nickname">范炯荣</p>
                        <p class="phone">155****2614</p>
                    </div>
                </div>
            </div>
            <divider></divider>
            <cellBox is-link link="/orderList"><img src="@/images/order.png"><span>我的订单</span></cellBox>
        </view-box>
    </div>
</template>


<script>
import { ViewBox, CellBox, Divider } from 'vux';
export default {
	components: {
		ViewBox,
		CellBox,
		Divider,
	},
};
</script>

