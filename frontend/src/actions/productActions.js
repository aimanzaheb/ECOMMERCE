import axios from 'axios'
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from '../constants/productConstants'

export const listProducts = () => async (dispatch, getState) => {
  //this async returned func will be handle by redux-thunk
  //will get fire from HomeScreen.js

  try {
    dispatch({ type: PRODUCT_LIST_REQUEST }) //dispatch action object to reducer from redux-thunk

    const { data } = await axios.get('/api/products')

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message //our custom msg from backend
          : error.message, //generic message
    })
  }
}

//SAME AS
// export const listProducts = () => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({ type: PRODUCT_LIST_REQUEST })

//       const { data } = await axios.get('/api/products')

//       dispatch({
//         type: PRODUCT_LIST_SUCCESS,
//         payload: data,
//       })
//     } catch (error) {
//       dispatch({
//         type: PRODUCT_LIST_FAIL,
//         payload:
//           error.response && error.response.data.message
//             ? error.response.data.message
//             : error.message,
//       })
//     }
//   }
// }

export const listProductDetails = (id) => async (dispatch, getState) => {
  //this async returned func will be handle by redux-thunk
  //will get fire from ProductScreen.js

  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST }) //dispatch action object to reducer from redux-thunk

    const { data } = await axios.get(`/api/products/${id}`)

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message //our custom msg from backend
          : error.message, //generic message
    })
  }
}
