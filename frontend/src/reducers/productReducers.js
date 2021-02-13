import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from '../constants/productConstants'

export const productListReducer = (state = { products: [] }, action) => {
  //passed previous/initial state

  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] } //new state
    case PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload }
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

const productDetailsInitialState = { loading: true, product: { reviews: [] } }
export const productDetailsReducer = (
  state = productDetailsInitialState, //passed previous/initial state
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return productDetailsInitialState //new state
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload }
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return productDetailsInitialState //reset state on any other action even actions dispatch by HomeScreen
  }
}
