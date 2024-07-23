import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import axios from 'axios'
import SearchInput from './'
import { SourceAPI } from '../../utils/models';
import { MemoryRouter } from 'react-router-dom';

const axiosMock = axios as jest.Mocked<typeof axios>;

const book = {
  id: 'SqikDwAAQBAJ',
  title: 'JavaScript - Aprende a programar en el lenguaje de la web',
  portada: 'http://books.google.com/books/content?id=SqikDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api'
}

const bookOpenLibrary = {
  key: 'SqikDwAAQBAJ',
  title: 'JavaScript - Aprende a programar en el lenguaje de la web',
  cover_i: 'http://books.google.com/books/content?id=SqikDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api'
}

test('SearchInput: Should get books when SearchInput is mounted', async () => {
  const setBooks = jest.fn()
  const books = [ book ]
  const response = {
    data: {
      items: books
    }
  }

  axiosMock.get.mockResolvedValue(response)

 await act(async () => {
    render(
      <MemoryRouter>
        <SearchInput 
          url='' 
          sourceAPI={SourceAPI.GOOGLE}
          withActions={false}
          setBooks={setBooks} />
      </MemoryRouter>
    );
  });

  await waitFor(() => {
    expect(setBooks).toHaveBeenCalledWith(expect.any(Function));
  })
})


test('SearchInput: Should get books when click on Buscar', async () => {
  const setBooks = jest.fn()
  const books = [ bookOpenLibrary ]
  const response = {
    data: {
      docs: books
    }
  }
  axiosMock.get.mockResolvedValue(response)

  render(<SearchInput url='' withActions sourceAPI={SourceAPI.OPEN} setBooks={setBooks} />)

  await waitFor(() => {
    expect(setBooks).toHaveBeenCalledWith(expect.any(Function));
  })

  fireEvent.change(screen.getByPlaceholderText(/Buscar/i),
    { target: { value: 'react' } }
  )

  fireEvent.click(screen.getByText('Buscar'))

  await waitFor(() => {
    expect(setBooks).toHaveBeenCalledTimes(2)
  })
})
