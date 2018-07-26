
import Vue from 'vue';
import { AjaxPlugin } from 'vux';
import qs from 'qs';
Vue.use(AjaxPlugin);
Vue.http.defaults.baseURL = '/apiv';
Vue.http.defaults.timeout = 20000;
Vue.http.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
Vue.http.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

Vue.http.interceptors.request.use(config => config, err => Promise.reject(err));
const $http = promise => promise.then(res => res.data).catch(err => Promise.reject(err));

const getShopList = params => $http(Vue.http.get("/publicPlatform/api/shop", {
    params
}));

const getCategoryByShop = shopId => $http(Vue.http.get(`/publicPlatform/api/goodsCats/shopGoodsCats/${shopId}`));

const getProductsByCategory = (shopId, categoryId) => $http(Vue.http.get(`/publicPlatform/api/goods/${shopId}/${categoryId}`));

const getProductDetail = id => $http(Vue.http.get(`/publicPlatform/api/goods/${id}`));

const getBanners = shopId => $http(Vue.http.get(`/publicPlatform/api/shop/carouselImg/${shopId}`));

const setWechatConfig = params => {
  return $http(
    Vue.http.post('/publicPlatform/api/auth/jsapiSignature',qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  );
};
const getUserInfo = params => {
  return $http(Vue.http.get('/publicPlatform/api/user/userInfo', { params }));
};

const getOrderList = params => {
  return $http(Vue.http.get('/publicPlatform/api/orders/myOrders', {params}));
};

const addAddress = params => {
  return $http(Vue.http.post('/publicPlatform/api/userAddress', qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    })
  );
};

const getOpenId = code => {
  return $http(Vue.http.get(`/publicPlatform/api/auth/openId/${code}`));
};

const getUserAddressList = openId => {
  return $http(Vue.http.get(`/publicPlatform/api/userAddress?openId=${openId}`));
};


const addOrder = params => {
  return $http(Vue.http.post(`/publicPlatform/api/orders`,params));
};



const imgPath=process.env.SERVER_NAME+'/publicPlatform/image/read?imageKey=';

export {
    setWechatConfig,
    getUserInfo,
    getOrderList,
    getBanners,
    getProductDetail,
    getProductsByCategory,
    getCategoryByShop,
    getShopList,
    addAddress,
    getOpenId,
    getUserAddressList,
    addOrder,
    imgPath
};

