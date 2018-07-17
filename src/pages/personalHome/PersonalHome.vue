<!--
Description
@authors Your Name (you@example.org)
@date    2018-07-06 20:13:34
@version 1.0.0
-->
<style lang="less" scoped src="./PersonalHome.less"></style>
<template>
    <div id="personal">
        <div class="person-info-wrapper clearfix">
            <div class="person-info-real">
                <img class="avator" src="@/images/personal/avator.png">
                <div class="text-info">
                    <p class="nickname">{{username}}</p>
                    <p class="phone">{{phone}}</p>
                </div>
            </div>
        </div>
        <cell-box is-link link="/orderList">
            <img src="@/images/order.png" />
            <span>我的订单</span>
        </cell-box>
    </div>
</template>
<script>
export default {
    data() {
        return {
            username: '范炯荣',
            phone: '155****2614'
        }
    }
}
</script>


