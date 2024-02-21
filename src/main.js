import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPhotoByKeyword } from './js/pixabay-api.js';
import { loadGallery } from './';

export let curPage;

const refs = {
  formRef: document.querySelector('.form'),
  formInputRef: document.querySelector('.form-input'),
  galleryRef: document.querySelector('.gallery'),
  loaderRef: document.querySelector('.loader'),
  loadMoreBtnRef: document.querySelector('.load-more-btn'),
  upBtnRef: document.querySelector('.up-btn'),
};

const lightboxOptions = {
  captionDelay: 250,
  captionsData: 'alt',
};

let userValue;
const lightbox = new SimpleLightbox('.gallery a', lightboxOptions);

refs.formRef.addEventListener('submit', e => {
  curPage = 1;
  e.preventDefault();
  refs.galleryRef.innerHTML = '';
  refs.loaderRef.classList.remove('hide');
  refs.loadMoreBtnRef.classList.add('hide');

  userValue = refs.formInputRef.value;

  if (userValue.trim() === '') {
    refs.formRef.reset();
    refs.loaderRef.classList.add('hide');
  } else {
    getPhotoByKeyword(userValue)
      .then(data => {
        refs.formRef.reset();
        if (data.totalHits > 15) {
          refs.loadMoreBtnRef.classList.remove('hide');
          refs.upBtnRef.classList.remove('hide');
        }
        if (data.hits.length === 0) {
          iziToast.error({
            message:
              'Sorry, there are no images matching your search query. Please, try again!',
            messageColor: 'white',
            backgroundColor: 'red',
            position: 'topRight',
            maxWidth: 432,
          });
        }

        refs.galleryRef.innerHTML = loadGallery(data);

        lightbox.on('show.simplelightbox');
        lightbox.refresh();
      })
      .catch(err =>
        iziToast.error({
          message: err.message,
          position: 'topRight',
          maxWidth: 432,
        })
      )
      .finally(() => {
        refs.loaderRef.classList.add('hide');
      });
  }
});

refs.loadMoreBtnRef.addEventListener('click', () => {
  refs.loaderRef.classList.remove('hide');
  refs.loadMoreBtnRef.classList.add('hide');
  curPage++;

  getPhotoByKeyword(userValue)
    .then(data => {
      if (data.totalHits >= curPage * 15) {
        refs.loadMoreBtnRef.classList.remove('hide');
        refs.galleryRef.insertAdjacentHTML('beforeend', loadGallery(data));
      } else {
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
      lightbox.refresh();

      const rect = document
        .querySelector('.gallery-item')
        .getBoundingClientRect();
      window.scrollBy({
        top: rect.height * 2,
        behavior: 'smooth',
      });
    })
    .catch(err =>
      iziToast.error({
        message: err.message,
        position: 'topRight',
        maxWidth: 432,
      })
    )
    .finally(() => {
      refs.loaderRef.classList.add('hide');
    });
});

refs.upBtnRef.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});