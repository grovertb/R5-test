import './book.css'

export type BookType = {
  id: string
  title: string
  portada: string
  onClick?: (id: string) => void
}

export interface BookProps extends BookType {
}

const Book = ({ portada, title, id, onClick }: BookProps) => {
  const _handleClick = () => {
    if(onClick) onClick(id)
  }

  return (
    <div className="book" onClick={_handleClick}>
      <div className="book-image">
        { 
          portada ? 
          <img
            alt={title}
            src={portada}/> : 
          <img src="https://picsum.photos/200/260" alt="default" />
        }
      </div>
      <p className="book-title">{title}</p>
    </div>
  )
}

export default Book
