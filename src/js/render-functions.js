import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function renderGallery(images) {
  console.log(images);

  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <li class="gallery-item">
      <div class="card-info">
        <a href="${largeImageURL}">
          <img class="gallery-image" 
            src="${webformatURL}" 
            alt="${tags}" 
            loading="lazy" 
          />
        </a>
        <div class="info">
          <p><span class="likes-label">Likes:</span> ${likes}</p>
          <p><span class="views-label">Views:</span> ${views}</p>
          <p><span class="comments-label">Comments:</span> ${comments}</p>
          <p><span class="downloads-label">Downloads:</span> ${downloads}</p>
        </div>
      </div>
    </li>`
    )
    .join('');

  galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  galleryContainer.innerHTML = '';
}

export function showLoader() {
  loader.classList.add('is-visible');
}

export function hideLoader() {
  loader.classList.remove('is-visible');
}

export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('hidden');
}

export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('hidden');
}
