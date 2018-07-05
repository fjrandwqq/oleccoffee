<style scoped lang="less" src="./Home.less"></style>
<template>
    <div id="home">
        <group>
        <cell title="title" value="value"></cell>

        </group>
        <x-button type="primary">asdasd</x-button>
    </div>
</template>
<script>
import { Group, Cell,XButton  } from "vux";
export default {
  components: {
    Group,
    Cell,
    XButton,
  },
  data() {
    return {};
  },
  watch: {},
  methods: {},
  created() {}
};
</script>
