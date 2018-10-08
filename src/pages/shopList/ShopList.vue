<!--
Description 店铺信息
@authors Your Name (you@example.org)
@date    2018-09-15 09:35:58
@version 1.0.0
-->
<template>
    <div class="shop-list">
        <cell-box>
            <div class="shop-item">
                <div class="title">大学城店 020-85828415<a href="tel:020-85828415"><img src="@/images/phone.png" alt=""></a></div>
                <div class="address">广州大学城GOGO新天地商业广场欧蕾克咖啡分店（鸿门宴旁）</div>
            </div>
        </cell-box>
        <cell-box>
            <div class="shop-item">
                <div class="title">科学城店 020-22201529 <a href="tel:020-22201529"><img src="@/images/phone.png" alt=""></a></div>
                <div class="address">广州高新技术产业开发区科学城科学大道193号优托邦（科学店）自编号A6-102B铺</div>
            </div>
        </cell-box>
    </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
    .shop-item{
        background-color:#fff;
        div{
             padding:0 15px;
             border-radius:4px;
        }
        .title{
            height:30px;
            line-height:30px;
            font-size:18px;
           
        }
        .address{
            margin-top:10px;
        }
        a{
            float:right;
            margin-left:15px;
            img{
                height:18px;
            }
        }
    }
</style>
