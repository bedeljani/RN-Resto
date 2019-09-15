import axios from 'axios'

// API 
import  { API_MENUS } from '../../service/api'

export const getData = () => ({
  type: "GET_MENUS",
  payload: axios({
    method: 'GET',
    url: API_MENUS
  })
})