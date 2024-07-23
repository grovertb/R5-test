import { useCallback, useState } from 'react'

import SearchInput from '../components/SearchInput'
import {BookType} from '../components/Book'
import Books from '../components/Books'
import { SourceAPI } from '../utils/models'
import { useNavigate } from 'react-router-dom'

const BookStore = () =>  {
  const [books, setBooks] = useState<BookType[]>([])

  const navigate = useNavigate()

  const _handleClickDetailBook = useCallback((id: string) => {
    navigate(`/bookstore/${id}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <SearchInput 
        url='https://openlibrary.org/search.json?q='
        withActions={true}
        sourceAPI={SourceAPI.OPEN}
        setBooks={setBooks} />
	    <Books books={books} onClick={_handleClickDetailBook} /> 
    </div>
  )
}


export default BookStore
