import axios from 'axios';
import { curPage } from '../main.js';

export async function getPhotoByKeyword(query) {
  const API_KEY = '42127236-8bfdbbfbeed8a2dadaca720e8';
  const PARAMS = '/api/';
  axios.defaults.baseURL = 'https://pixabay.com';

  const response = await axios.get(PARAMS, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horisontal',
      safesearch: true,
      per_page: 15,
      page: curPage,
    },
  });
  return response.data;
}