import { useEffect, useRef, useState } from 'react'
import { 
  Avatar,
  Box,
  Button,
  Card, CardContent, 
  CardHeader, Container, IconButton, 
  Paper, 
  TextField, 
  Typography
} from '@mui/material'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { getStorageByKey } from '../utils'

dayjs.locale('es')

interface BookDetailType {
  title: string
  description: string
  portada: string
  created: string
}

const BookDetail = () => {
  const [ isFavorite, setFavorite ] = useState(false)
  const [ localComments, setLocalComments ] = useState<String[]>([])
  const { bookId } = useParams()
  const [ book, setBook ] = useState<BookDetailType>()
  const inputRef = useRef<HTMLInputElement>()
  useEffect(() => {
    preloadComments()
    preloadIsFavorite()

    axios.get(`https://openlibrary.org/works/${bookId}.json`)
    .then(result => {
      const { title, description, covers, created } = result.data

      setBook({
        title,
        description: description?.value,
        portada: `https://covers.openlibrary.org/b/id/${covers[0]}-M.jpg`,
        created: dayjs(created?.value).format('DD/MM/YYYY')
      })
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const preloadComments = () => {
    const localComments = getStorageByKey('storageComments')
    const commentByBook = localComments.find((item: any) => item.id === bookId)
    if(commentByBook?.comments) setLocalComments(commentByBook.comments)
  }

  const preloadIsFavorite = () => {
    const localFavorites = getStorageByKey('storageFavorites')
    const isFavorite = localFavorites.some((item: any) => item === bookId)
    setFavorite(isFavorite)
  }

  const _handleClickFavorite = () => {
    setFavorite(prevState => !prevState)

    const storageLocal = getStorageByKey('storageFavorites')
    const index = storageLocal.findIndex((item: string) => item === bookId)
    const newData = (index === -1) ? storageLocal.concat(bookId) : [...storageLocal.slice(0, index), ...storageLocal.slice(index+1) ]
    
    localStorage.setItem('storageFavorites', JSON.stringify(newData))
  }

  const _handleClickSendComment = () => {
    const storageLocal = getStorageByKey('storageComments')

    const index = storageLocal.findIndex((item: any) => item.id === bookId)


    if(inputRef.current) {
      const currentComment = inputRef.current.value
      
      if(index === -1) {
        storageLocal.push({
          id: bookId,
          comments: [ currentComment ]
        })
      } else {
        storageLocal[index].comments.push(currentComment)
      }

      setLocalComments(prevState => prevState.concat(currentComment))

      localStorage.setItem('storageComments', JSON.stringify(storageLocal))
  
      inputRef.current.value = ''
    }
  }

  return (
    <Container sx={{my: 4, justifyContent: 'center', display: 'flex'}}>
      <Card sx={{ maxWidth: 600 }} variant='outlined'>
        <CardHeader
          title={book?.title} 
          action={
            <IconButton data-testid="favorite-button" onClick={_handleClickFavorite}>
              {
                isFavorite ? (
                  <FavoriteIcon color='error' />
                ) : (
                  <FavoriteBorderIcon color='error' />
                )
              }
            </IconButton>
          } 
        />
        <CardContent sx={{display: 'flex', flexDirection: 'column'}}>
          <Box sx={{ display:'flex' }}>
            <img src={book?.portada} style={{width: 180}} alt={book?.title} />
            <Box sx={{ ml: 2 }}>
              <Typography variant='body1'>
                Fecha de creación: {book?.created}
              </Typography>
              <Typography variant='body1'>
                {book?.description}
              </Typography>
            </Box>
          </Box>
          {
            localComments.length ? (
              <Paper sx={{mt: 1, p: 1}} variant='outlined'>
                <Typography fontWeight='bold'>Comentarios:</Typography>
                {
                  localComments.map((item, index) => (
                    <Box sx={{display:'flex', overflowWrap: 'anywhere', mt: 2}} key={`comment-${index + 1}`}>
                      <Avatar />
                      <Typography sx={{ml: 1}}>
                        {item}
                      </Typography>
                    </Box>
                  ))
                }
              </Paper>
            ) : null
          }
          <Box sx={{ textAlign: 'end' }}>
            <TextField 
              inputProps={{
                'data-testid':"sendCommentInput"
              }}
              inputRef={inputRef}
              fullWidth
              sx={{ mt:2 }}
              rows={4}
              multiline
              placeholder='Agrega tu comentario' />
            <Button data-testid="sendCommentButton" onClick={_handleClickSendComment} sx={{mt: 1}} variant='outlined'>Enviar comentario</Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default BookDetail