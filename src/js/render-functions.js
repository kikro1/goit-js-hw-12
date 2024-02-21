export function loadGallery(data) {
    const markup = data.hits.map(data => {
      return `<li class="gallery-item">
          <a href="${data.largeImageURL}"><img src="${data.webformatURL}" alt="${data.tags}" class="gallery-image" /></a>
          <div class="gallery-wrap">
          <p><b>Likes</b><br />${data.likes}</p>
          <p><b>Views</b><br />${data.views}</p>
          <p><b>Comments</b><br />${data.comments}</p>
          <p><b>Downloads</b><br />${data.downloads}</p>
          </div>
        </li>`;
    });
    return markup.join('');
  }