import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import axiosMock from 'axios'
import BookDetail from './BookDetail'
import { getStorageByKey } from '../utils'

jest.mock('axios')

const axios = axiosMock as jest.Mocked<typeof axiosMock>

jest.mock('../utils', () => ({
  getStorageByKey: jest.fn()
}))

describe('BookDetail', () => {
  const mockBook = {
    title: 'JavaScript - Aprende a programar en el lenguaje de la web',
    description: 'Un libro sobre JavaScript',
    covers: [12345],
    created: { value: '2022-07-21T00:00:00Z' }
  }

  const mockBookId = 'mockBookId'

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockBook });

    (getStorageByKey as jest.Mock).mockImplementation((key) => {
      if (key === 'storageFavorites') {
        return []
      }
      if (key === 'storageComments') {
        return []
      }
      return []
    })

    // Configura localStorage mock
    localStorage.setItem('storageFavorites', JSON.stringify([]))
    localStorage.setItem('storageComments', JSON.stringify([]))
  })

  test('should fetch and display book details on mount', async () => {
    render(
      <MemoryRouter initialEntries={[`/bookstore/${mockBookId}`]}>
        <Routes>
          <Route path="/bookstore/:bookId" element={<BookDetail />} />
        </Routes>
      </MemoryRouter>
    )

    const title = await screen.findByText((content) => 
      content.includes(mockBook.title)
    );
    
    expect(title).toBeInTheDocument();
  })

  test('should handle favorite button click', async () => {
    render(
      <MemoryRouter initialEntries={[`/bookstore/${mockBookId}`]}>
        <Routes>
          <Route path="/bookstore/:bookId" element={<BookDetail />} />
        </Routes>
      </MemoryRouter>
    )
    
    
    // Encuentra el botón de favorito usando el name especificado
    const favoriteButton = await screen.findByTestId('favorite-button');
    expect(favoriteButton).toBeInTheDocument();
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      const favorites = JSON.parse(localStorage.getItem('storageFavorites') || '[]');
      expect(favorites).toContain(mockBookId);
    });
  })

  test('should handle adding comments', async () => {
    render(
      <MemoryRouter initialEntries={[`/bookstore/${mockBookId}`]}>
        <Routes>
          <Route path="/bookstore/:bookId" element={<BookDetail />} />
        </Routes>
      </MemoryRouter>
    )

    const commentInput = await screen.findByTestId('sendCommentInput')
    const commentButton = await screen.findByTestId('sendCommentButton')

    fireEvent.change(commentInput, { target: { value: 'Este es un comentario' } })
    fireEvent.click(commentButton)

    await waitFor(() => {
      expect(screen.getByText('Este es un comentario')).toBeInTheDocument()
    })
  })
})
