import Book , { BookType }from '../Book'
import './books.css'

interface BooksProps {
  books: BookType[];
  onClick?: (id: string) => void
}

const Books = ({ books, onClick }: BooksProps) => {
  return (
    <div className="books">
      {
        books.map(book => 
          <Book 
            key={book.id}
            id={book.id}
            portada={book.portada}
            onClick={onClick}
            title={book.title}  />
        )
      }
    </div>
  )
}

export default Books
