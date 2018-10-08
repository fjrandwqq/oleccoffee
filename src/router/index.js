import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/homePage',
      alias: ['/index'],
      component: resolve => require(['@/pages/home/Home.vue'], resolve),
      meta: {
        requiresAuth: false,
      },
      children: [
        {
          path: '/homePage',
          name: 'homePage',
          meta: {
            requiresAuth: false,
          },
          component: resolve => require(['@/pages/homePage/HomePage.vue'], resolve), //首页
        },
        {
          path: '/personalHome',
          name: 'personalHome',
          meta: {
            requiresAuth: true,
            title: '我的',
          },
          component: resolve => require(['@/pages/personalHome/PersonalHome.vue'], resolve), //个人中心（我的）
        },
      ],
    },
    {
      path: '/orderList',
      name: 'orderList',
      meta: {
        requiresAuth: true,
        title: '我的订单',
      },
      component: resolve => require(['@/pages/orderList/OrderList.vue'], resolve), //我的订单
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      meta: {
        requiresAuth: true,
        title: '提交订单',
      },
      component: resolve => require(['@/pages/orderConfirm/OrderConfirm.vue'], resolve), //我的订单
    },
    {
      path: '/addAddress',
      name: 'addAddress',
      meta: {
        requiresAuth: true,
        title: '新增收货地址',
      },
      component: resolve => require(['@/pages/addAddress/AddAddress.vue'], resolve), //新建收货地址
    },
    {
      path: '/shopList',
      name: 'shopList',
      meta: {
        requiresAuth: true,
        title: '店铺信息',
      },
      component: resolve => require(['@/pages/shopList/ShopList.vue'], resolve), //我的订单
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.querySelector('title').innerHTML = (to.meta && to.meta.title) || '欧蕾克咖啡';
  next();
});

export default router;
