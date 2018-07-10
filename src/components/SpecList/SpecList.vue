<style lang="less" scoped src="./SpecList.less"></style>
<template>
    <div class="parameter-group">
        <div class="label">{{label}}</div>
            <ul class="parameter-list">
                <li :class="{active:selectedIndex==index}" @click.stop="selectSpec(spec,index)" v-for="(spec,index) in specs" :key="index" class="parameter">{{spec.text}}</li>
            </ul>
        </div>
</template>
<script>
export default {
    name:'SpecList',
    model:{
        prop:'value',
        event:'click'
    },
    props:{
        value:{
            type:[String,Number]
        },
        label:String,
        specs:{
            type:Array,
            required:true
        }
    },
    data(){
        return{
            selectedIndex:0
        }
    },
    methods:{
        selectSpec(spec,index){
            this.selectedIndex=index;
            this.$emit('click',spec.id);
        }
    }
}
</script>


