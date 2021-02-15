import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container fluid='xl'>
          <Route path='/login' component={LoginScreen} />
          <Route path='/products/:id' component={ProductScreen} />
          <Route path='/cart/:id?' component={CartScreen} />
          {/* cart id is optional */}

          <Route path='/' component={HomeScreen} exact />
          {/* exact - prevent HomeScreen load on url '/anything' */}
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
