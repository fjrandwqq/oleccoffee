import {
    SET_CART_GOODS
} from './mutationTypes';

import {setStore, getStore} from '../services/utils';

export default {
    setOpenId(state, openId) {
        state.openId = openId;
    },
    setShopInfo(state, shopInfo){
        state.shopInfo = shopInfo;
    },
    setUserInfo(state,userInfo){
        state.userInfo=userInfo;
    },
    /**
     * 购物车数据存入vuex
     */
    [SET_CART_GOODS](state,cartGoods){
        state.cartGoods=cartGoods;
    }

};
