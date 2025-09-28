import axios from 'axios';

const API_KEY = '51904877-a497cebd24b125b23f704ea34';
const BASE_URL = 'https://pixabay.com/api/';
export async function fetchImages(query, page = 1, perPage = 15) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
