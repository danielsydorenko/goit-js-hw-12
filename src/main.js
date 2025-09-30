import { getImagesByQuery } from './js/pixabay-api.js';

import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 15; // скільки картинок за раз
//const totalPages = Math.ceil(data.totalHits / perPage);
searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  console.log(event.target.elements.search.value);
  clearGallery(); // очищаємо галерею перед новим пошуком

  hideLoadMoreButton(); // приховуємо кнопку

  query = event.target.elements.search.value.trim();
  if (!query) {
    iziToast.show({
      title: '⚠️',
      color: 'green',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  page = 1; // скидати сторінку при новому пошуку

  try {
    showLoader(); // показуємо лоадер

    const data = await getImagesByQuery(query, page, perPage);
    // Очищуємо галерею перед новим пошуком
    //galleryContainer.innerHTML = '';

    if (data.hits.length === 0) {
      iziToast.show({
        title: '❌',
        color: 'red',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });

      return;
    }
    renderGallery(data.hits);
    // Якщо є ще сторінки — показуємо кнопку
    const totalPages = Math.ceil(data.totalHits / perPage);

    if (page < totalPages) {
      showLoadMoreButton();
      console.log(data.totalHits);
    } else {
      // Якщо всі результати вміщаються на одній сторінці
      iziToast.show({
        message: 'We are sorry, but you have reached the end of search results',
        position: 'topRight',
        color: 'blue',
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader(); // ховаємо лоадер після завершення
    searchForm.reset(); //очищаємо форму після відправки
  }
});
loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideLoadMoreButton();

  try {
    showLoader();
    const data = await getImagesByQuery(query, page, perPage);
    renderGallery(data.hits);
    showLoadMoreButton();
    //  беремо висоту першої карточки
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    //console.log(cardHeight);

    //  прокрутка на дві висоти картки
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    // Якщо це остання сторінка — ховаємо кнопку
    if (page >= Math.ceil(data.totalHits / perPage)) {
      console.log(data.totalHits);

      hideLoadMoreButton();
      iziToast.info({
        //title: 'End of results',
        message: 'We are sorry, but you have reached the end of search results',
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }
});
