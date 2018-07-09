<style lang="less" scoped src="./HomePage.less"></style>

<template>
  <div id="home-page">
    <div class="address">
      <div class="address-left">
        <img src="../../images/mark.png" height="20">
        <span>士大夫撒地方的说法是打发沙发啥地方</span>
        <x-icon type="ios-arrow-right" size="15"></x-icon>
      </div>
      <a class="phone" @click="call">
        <img src="../../images/phone.png" height="20">
      </a>
    </div>
    <div class="content">
      <div class="swiper-wrapper">
        <swiper auto loop :show-dots="false" height="100%" :list="bannerList" v-model="swiperIndex"></swiper>
      </div>
      <div class="shop-wrapper">

        <div class="catogory-wrapper" ref="categoryWrapper">
          <div class="categories">
            <a :class="{active:categoryIndex==index}" @click="selectCategory(category,index)" v-for="(category,index) in categories" class="category needsclick" :key="index">
              {{category.text}}
            </a>
          </div>
        </div>
        <div class="product-wrapper" ref="productWrapper">
          <div class="products">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll"
import { Swiper } from "vux"
export default {
  components: {
    Swiper
  },
  data() {
    return {
      swiperIndex: 0,
      categoryIndex: 0,
      products: [
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          title: "自行车自行车在",
          desc: "啊实打实多啥 ",
          src:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        }
      ],
      categories: [
        {
          text: "盛大发售发顺丰双方都啥地方"
        },
        {
          text: "盛方都啥地方"
        },
        {
          text: "盛大发售方都啥地方"
        },
        {
          text: "方都啥地方"
        },
        {
          text: "盛大地方"
        },
        {
          text: "啥地方"
        },
        {
          text: "盛大发地方"
        },
        {
          text: "盛啥地方"
        },
        {
          text: "盛大发啥地方"
        }
      ],
      bannerList: [
        {
          url: "javascript:",
          img:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg"
        },
        {
          url: "javascript:",
          img:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg"
        },
        {
          url: "javascript:",
          img: "https://static.vux.li/demo/5.jpg",
          fallbackImg:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg"
        }
      ]
    };
  },
  computed: {},
  methods: {
    selectCategory(category, index) {
      this.categoryIndex = index
    },
    call(){

    },
    showProductDetail(product) {}
  },
  mounted() {
    this.$nextTick(() => {
      const options={
        click: true,
        tap: true
      }
      let cScroll = new BScroll(this.$refs.categoryWrapper,options)
      let pScroll = new BScroll(this.$refs.productWrapper,options)
    });
  }
};
</script>

