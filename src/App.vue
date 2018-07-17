<style lang="less" src="./style/custom.less"></style>
<template>
    <div id="app">
        <transition :name="transitionName">
             <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>
<script>
    export default {
        name: 'app',
        data(){
            return{
                transitionName:'swipe-left'
            }
        },
        watch:{
            $route(to, from){
                const name=to.name
                // if(name!='homePage' || name!="personalHome"){
                    this.transitionName=`swipe-${name!=this.$router.lastRouteName?'left':'right'}`;
                // }
                this.$router.lastRouteName=from.name;
            }
        },
        mounted() {
            // this.$router.push('/');
        }
    }
</script>