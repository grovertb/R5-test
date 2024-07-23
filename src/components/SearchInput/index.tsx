import React, {ChangeEvent, useCallback, useEffect, useState} from 'react'
import axios from 'axios'

import { SourceAPI } from '../../utils/models';
import { BookType } from '../Book';
import './SearchInput.css'

interface SearchInputProps {
  setBooks: React.Dispatch<React.SetStateAction<BookType[]>>;
  url: string;
  withActions?: boolean;
  sourceAPI: SourceAPI
}

const perPage = 20


const SearchInput = ({ setBooks, url, sourceAPI, withActions = false }: SearchInputProps) => {
  const [searchValue, setSearchValue] = React.useState('react')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(
        sourceAPI === SourceAPI.GOOGLE ?
        {
          startIndex: String((page - 1) * perPage),
          maxResults: String(perPage),
        } : {
          page: String(page),
          limit: String(perPage)
        }
      ).toString()

      const { data } = await axios.get(`${url}${searchValue}&${params}`)

      const newData = (
        sourceAPI === SourceAPI.GOOGLE ?
          data.items.map((item: any) => ({
            id: `${item.id}${item.etag}`,
            title: item.volumeInfo?.title,
            portada: item.volumeInfo?.imageLinks?.smallThumbnail
          })) :
          data.docs
            .filter((item: any) => item.key && item.cover_i)
            .map((item: any) => {
              const keys = item.key.split('/')

              return {
                id: keys[keys.length - 1],
                title: item.title,
                portada: `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
              }
            })
      )

      setBooks(prevBooks => page === 1 ? newData : [ ...prevBooks, ...newData ])
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchValue])


  useEffect(() => {
    fetchBooks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.offsetHeight

    if (loading) return
    if (documentHeight - (scrollTop + windowHeight) <= 250) setPage((prevPage) => prevPage + 1)
  }, [loading])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const _handleInputSearch = (ev: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(ev.target.value)
  }

  const _handleClickSearch = () => {
    setPage(1)
    setBooks([])
    fetchBooks()
  }

  return (
    <div className="search">
      <h1>GOOGLE BOOKS</h1>
      {
        withActions ? (
          <>
            <input
              className="search-input"
              type="text"
              placeholder="Buscar un libro"
              value={searchValue}
              onChange={_handleInputSearch}
            />
            <button 
              className="search-button" 
              onClick={_handleClickSearch}>
              Buscar
            </button>
          </>
        ) : null
      }
    </div>
  )
}

export default SearchInput
