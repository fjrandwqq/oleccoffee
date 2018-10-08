<style lang="less" scoped src="./SpecList.less"></style>
<template>
    <div class="parameter-group">
        <div class="label">{{label}}</div>
            <ul class="parameter-list">
                <li :class="{active:value.name==spec.name}" @click.stop="selectSpec(spec,index)" v-for="(spec,index) in specs" :key="index" class="parameter">{{spec.name}}</li>
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
        label:String,
        specs:{
            type:Array,
            required:true
        },
        value:{
            type:Object
        }
    },
    data(){
        return{
            selectedIndex:0
        }
    },
    mounted(){
    },
    methods:{
        selectSpec(spec,index){
            this.$emit('on-change',spec);
            this.$emit('click',spec);
        }
    }
}
</script>


