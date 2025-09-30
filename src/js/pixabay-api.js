import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

import axios from 'axios';

const API_KEY = '52348625-41a9db4c50e5799aece4dcd77';

const BASE_URL = 'https://pixabay.com/api/';
export async function getImagesByQuery(query, page = 1, perPage = 60) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  });

  const url = `${BASE_URL}?${searchParams}`;

  try {
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    throw new Error(`Не вдалося отримати зображення: ${error.message}`);
  }
}
