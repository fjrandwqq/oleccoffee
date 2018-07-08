import Vue from 'vue';
import Router from 'vue-router';

import PersonalHome from '../pages/personal/personalHome/PersonalHome';
import OrderList from '../pages/personal/orderList/OrderList';

const Home = resolve => require(['@/pages/home/Home.vue'], resolve);


Vue.use(Router);

const router = new Router({
    routes: [{
        path: '/',
        name: 'home',
        alias: ['/index'],
        component: PersonalHome
    },{
        path: '/personal/order',
        name: 'order',
        component: OrderList
    },{
        path: '*',
        redirect: '/'
    }]
});

export default router;
                                        