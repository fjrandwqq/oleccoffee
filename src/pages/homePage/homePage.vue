<style lang="less" scoped src="./homePage.less"></style>

<template>
  <div id="home-page">
    <group class="address">
      <cell title="水电费水电费第三方第三方水电费的说法舒服舒服所发生的爽肤水" is-link></cell>
    </group>
    <div class="content">
      <div class="swiper-wrapper">
      <swiper auto loop dots-position="center" height="100%" :list="bannerList" v-model="swiperIndex"></swiper>
    </div>
    <div class="shop-wrapper">

      <div class="catogory-wrapper">
        <ul class="categories">
          <li :class="{active:categoryIndex==index}" @click="selectCategory(category,index)" v-for="(category,index) in categories" class="category" :key="index">
            {{category.text}}
          </li>
        </ul>
      </div>
      <div class="product-wrapper">
        <div class="products">
          <panel @on-click-item="showProductDetail" :header="categories[categoryIndex].text" :list="products" type="5"></panel>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { Swiper } from "vux";
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
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg",
          title: "送你一朵fua"
        },
        {
          url: "javascript:",
          img:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg",
          title: "送你一辆车"
        },
        {
          url: "javascript:",
          img: "https://static.vux.li/demo/5.jpg", // 404
          title: "送你一次旅行",
          fallbackImg:
            "https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg"
        }
      ]
    };
  },
  computed: {

  },
  methods: {
    selectCategory(category, index) {
      this.categoryIndex = index;
    },
    showProductDetail(product) {}
  },
  mounted() {
    this.$nextTick(() => {
      let $categories = document.querySelector(".catogory-wrapper");
      let $products = document.querySelector(".product-wrapper");
      let cScroll = new BScroll($categories);
      let pScroll = new BScroll($products);
    });
  }
};
</script>

