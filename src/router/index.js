import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    routes: [{
        path: '/',
        name: 'home',
        redirect: '/homePage',
        alias: ['/index'],
        component: resolve => require(['@/pages/home/Home.vue'], resolve),
        children:[{
            path: '/homePage',
            name: 'homePage',
            component: resolve => require(['@/pages/homePage/homePage.vue'], resolve)
        }]
    }, {
        path: '*',
        redirect: '/'
    }]
});
/*router.beforeEach((to,from,next)=>{
    if(to.meta.requireAuth){
        if(getStore('token')){
            next();
        }else{
            next();
            // location.href="http://172.16.16.122:8080/security";
        }
    }else{
        next();
    }
});*/

export default router;
