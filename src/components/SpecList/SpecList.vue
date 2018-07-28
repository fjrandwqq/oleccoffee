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
        // this.value=
    },
    methods:{
        selectSpec(spec,index){
            // let oldSpec=this.specs[this.selectedIndex];
            // this.selectedIndex=index;
            // this.value=spec.text;
            // this.$emit('change',oldSpec,spec);
            this.$emit('click',spec);
        }
    }
}
</script>


