'use strict';

let shows = [];
let favorites = [];

const apiUrl = 'http://api.tvmaze.com/search/shows?q=';
const searchButton = document.querySelector ('.js-search-btn');
const searchInput = document.querySelector ('.js-input-movie');
const showsList = document.querySelector ('.js-list-movies');
const favoriteList = document.querySelector ('.list-fav-movie');
const urlNullShowImage =
  'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
const favTitle = document.querySelector ('.js-fav-tittle');

function clickButton () {
  fetch (apiUrl + searchInput.value)
    .then (function (response) {
      return response.json ();
    })
    .then (function (data) {
      shows = data;
      printShows ();
    });
}

function getImage (showInfo) {
  if (showInfo.show.image === null) {
    return urlNullShowImage;
  } else {
    return showInfo.show.image.medium;
  }
}

function printShows () {
  let codeHTML = '';
  for (let showInfo of shows) {
    const favorite = favorites.find (
      favoritesIDItem => favoritesIDItem.show.id === showInfo.show.id
    );
    if (favorite === undefined) {
      codeHTML += `<li class="js-show show" id=${showInfo.show.id}>`;
    } else {
      codeHTML += `<li class="js-show show favorite-color" id=${showInfo.show.id}>`;
    }
    codeHTML += `<img class="js-img-show img-show" src = ${getImage (showInfo)} alt='no image found'>`;
    codeHTML += `<p class="js-show-name show-name">${showInfo.show.name}</p>`;
    codeHTML += `</li class="js-show show">`;
  }
  showsList.innerHTML = codeHTML;

  listenShowsClicks ();
}

function listenShowsClicks () {
  const showLiList = document.querySelectorAll ('.js-show');
  for (let showLi of showLiList) {
    showLi.addEventListener ('click', colorAndFavShow);
  }
}

function colorAndFavShow (event) {
  const selectShow = event.currentTarget;
  selectShow.classList.toggle ('favorite-color');

  addOrRemoveFavorites (event);
}

function addOrRemoveFavorites (event) {
  const clickedShowId = parseInt (event.currentTarget.id);
  const show = shows.find (showItem => showItem.show.id === clickedShowId);
  const favorite = favorites.find (
    favoritesIDItem => favoritesIDItem.show.id === clickedShowId
  );
  if (favorite === undefined) {
    favorites.push (show);
  } else {
    favorites.splice (favorites.indexOf (favorite), 1);
  }
  updateLocalStorage ();
  printShowsFavorites ();
}

function printShowsFavorites () {
  getFromLocalStorage ();

  let codeFavoritesHTML = '';
  for (let favorite of favorites) {
    codeFavoritesHTML += `<li class="js-favorite-show favorite-show" id=${favorite.show.id}>`;
    codeFavoritesHTML += `<img class="js-img-favorite-show img-favorite-show" src = ${getImage (favorite)} alt='no image found'> `;
    codeFavoritesHTML += `<i class="far fa-times-circle times-circle" id=${favorite.show.id}></i>`;
    codeFavoritesHTML += `<p class="js-show-name show-name">${favorite.show.name}</p>`;
    codeFavoritesHTML += `</li class="js-favorite-show favorite-show">`;
  }

  if (favorites.length > 0) {
    codeFavoritesHTML += `<button class="js-remove-all-btn remove-all-btn">Borrar todas</button>`;
  }
  favoriteList.innerHTML = codeFavoritesHTML;
  if (favorites.length > 0) {
    favTitle.classList.remove ('hidden');
  } else {
    favTitle.classList.add ('hidden');
  }

  listenButtonRemoveFavorite ();
  listenRemoveAll ();
}

const updateLocalStorage = () => {
  localStorage.setItem ('favorites', JSON.stringify (favorites));
};

const getFromLocalStorage = () => {
  const data = JSON.parse (localStorage.getItem ('favorites'));
  if (data !== null) {
    favorites = data;
  }
};

function listenButtonRemoveFavorite () {
  const removeButtons = document.querySelectorAll ('.times-circle');
  for (let removeButton of removeButtons) {
    removeButton.addEventListener ('click', clickRemoveButton);
  }
}

function clickRemoveButton () {
  const clickedShowId = parseInt (event.currentTarget.id);
  const favorite = favorites.find (
    favoritesIDItem => favoritesIDItem.show.id === clickedShowId
  );
  favorites.splice (favorites.indexOf (favorite), 1);

  updateLocalStorage ();
  printShowsFavorites ();
  printShows ();
}

function listenRemoveAll () {
  if (favorites.length > 0) {
    const removeAllButton = document.querySelector ('.js-remove-all-btn');
    removeAllButton.addEventListener ('click', clickRemoveAll);
  }
}

function clickRemoveAll () {
  favorites = [];
  updateLocalStorage ();
  printShowsFavorites ();
  printShows ();
}

printShowsFavorites ();
searchButton.addEventListener ('click', clickButton);
