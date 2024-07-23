import { useState } from 'react'

import SearchInput from '../components/SearchInput'
import { BookType } from '../components/Book'
import Books from '../components/Books'
import { SourceAPI } from '../utils/models'


const Home = () =>  {
  const [books, setBooks] = useState<BookType[]>([])

  return (
    <div>
      <SearchInput
        url='https://www.googleapis.com/books/v1/volumes?q='
        sourceAPI={SourceAPI.GOOGLE}
        setBooks={setBooks} />
      <Books books={books} /> 
    </div>
  )
}


export default Home
