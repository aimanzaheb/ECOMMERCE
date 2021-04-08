import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProducts, deleteProduct } from '../actions/productActions'
import { PRODUCT_DELETE_RESET } from '../constants/productConstants'

const ProductListScreen = ({ history, match }) => {
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: isProductDeleteSuccess,
  } = productDelete

  const isAdminLoggedIn = userInfo && userInfo.isAdmin
  useEffect(() => {
    if (!isAdminLoggedIn) {
      history.push('/login')
      return
    }
    dispatch(listProducts())
  }, [dispatch, history, isAdminLoggedIn])

  useEffect(() => {
    if (isProductDeleteSuccess) {
      dispatch(listProducts())
      dispatch({ type: PRODUCT_DELETE_RESET })
      alert('Deleted Successfully')
    }
  }, [dispatch, isProductDeleteSuccess])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = (product) => {
    //CREATE PRODUCT
  }

  const currency = new Intl.NumberFormat('en-US', {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#Browser_compatibility
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  })

  if (!isAdminLoggedIn) return <></> //prevent unnecessary flash when redirect using history
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{currency.format(product.price)}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default ProductListScreen
