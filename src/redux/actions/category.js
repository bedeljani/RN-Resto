import axios from 'axios'

// API 
import  { API_CATEGORIES } from '../../service/api'

export const getData = () => ({
  type: "GET_CATEGORIES",
  payload: axios({
    method: 'GET',
    url: API_CATEGORIES
  })
})

