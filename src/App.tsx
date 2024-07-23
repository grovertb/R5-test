import { Routes, Route } from 'react-router-dom'

import Home from './containers/Home'
import BookStore from './containers/BookStore'
import BookDetail from './containers/BookDetail'

const App = () =>  {
  return (
    <Routes>
      <Route element={<Home />} index />
      <Route element={<BookStore />} path='/bookstore' />
      <Route element={<BookDetail />} path='/bookstore/:bookId' />
      <Route element={<h1>404 not found</h1>} path="*" />
    </Routes>
  )
}


export default App
