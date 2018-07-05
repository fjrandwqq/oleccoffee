import Vue from 'vue';

Vue.http.defaults.baseURL = '/api';
Vue.http.defaults.timeout = 10000;
Vue.http.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
Vue.http.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

Vue.http.interceptors.request.use(config => {
    return config;
}, err => Promise.reject(err));

export {

};
