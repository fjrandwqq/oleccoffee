import { ADD_CART_PRODUCTS, REDUCE_CART_PRODUCTS, CLEAR_CART_PRODUCTS } from './mutationTypes';
import { fixPrice } from '@/services/utils';
export default {
  setOpenId(state, openId) {
    state.openId = openId;
  },
  setShopInfo(state, shopInfo) {
    state.shopInfo = shopInfo;
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  /**
   * +1
   */
  [ADD_CART_PRODUCTS](
    state,
    { goodsId, goodsName, extraPrice, price, realPrice, discount, imgs, totalPrice, specListText, specList }
  ) {
    let item=state.cartProducts.find(e=>{
        return e.goodsId === goodsId&&e.specListText === specListText;
    });
    if(item){
        if(item.goodsNum<100){
            item.goodsNum++;
            item.totalPrice=fixPrice(item.goodsNum*item.payPrice)
        }
    }
    //新增一条
    else{
        let product={ goodsId, goodsName, extraPrice, price, realPrice, discount, imgs, totalPrice, specListText, specList };
        product.goodsNum=1;
        product.payPrice=fixPrice(realPrice+extraPrice);
        state.cartProducts.push(product);
    }
    console.log(state.cartProducts);
    
  },
  /**
   * -1
   * @param {*} state
   * @param {*} cartProducts
   */
  [REDUCE_CART_PRODUCTS](state, {goodsId,specListText}) {
      debugger
    state.cartProducts.forEach((e,index,arr) => {
      if (e.goodsId === goodsId &&e.specListText ===specListText) {
        if(e.goodsNum>1){ 
            e.goodsNum--;
            e.totalPrice=fixPrice(e.goodsNum*e.payPrice)
        }
        else{
            arr.splice(index,1);
        }
      }
    });
  },
  /**
   * 清空购物车
   */
  [CLEAR_CART_PRODUCTS](state) {
    state.cartProducts = [];
  },
};
