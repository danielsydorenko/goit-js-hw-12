import { fetchImages } from './js/pixabay-api';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './css/styles.css';

let query = '';
let page = 1;
const perPage = 15;

const searchForm = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  const searchInput = event.currentTarget.elements['searchQuery'];
  if (!searchInput) return;

  const searchValue = searchInput.value.trim();
  if (!searchValue) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term!',
      position: 'topRight',
    });
    return;
  }

  query = searchValue;
  page = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);

    if (!data || !data.hits || data.hits.length === 0) {
      iziToast.warning({
        title: 'No results',
        message: 'Sorry, no images found. Try another search!',
        position: 'topRight',
      });
      return;
    }

    // Перезаписуємо галерею при новому пошуку
    renderGallery(data.hits, { append: false });

    const totalPages = Math.ceil(data.totalHits / perPage);
    if (totalPages > 1) {
      showLoadMoreBtn();
    } else {
      iziToast.info({
        title: 'End of results',
        message: 'You have reached the end of search results.',
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error('❌ ERROR in onSearch:', error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while fetching data.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);

    // Додаємо нові зображення до вже існуючих
    renderGallery(data.hits, { append: true });

    const totalPages = Math.ceil(data.totalHits / perPage);
    if (page < totalPages) {
      showLoadMoreBtn();
    } else {
      iziToast.info({
        title: 'End of results',
        message: 'You have reached the end of search results.',
        position: 'topRight',
      });
    }

    hideLoader();
    smoothScroll();
  } catch (error) {
    console.error('❌ ERROR in onLoadMore:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
    hideLoader();
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
