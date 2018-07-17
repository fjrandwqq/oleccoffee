import Vue from 'vue';

Vue.http.defaults.baseURL = '/api';
Vue.http.defaults.timeout = 10000;
Vue.http.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
Vue.http.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

Vue.http.interceptors.request.use(config => {
    return config;
}, err => Promise.reject(err));

const $http=(promise,success,error)=>{
    promise.then((res)=>{
        success(res)
    }).catch(err=>{
        error(err);
    });
};

const setWechatConfig=()=>{
    return Vue.http('/publicPlatform/api/auth/jsapiSignature');
}
export {
    $http,
    setWechatConfig
};
