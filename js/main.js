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
    codeHTML += `<li class="js-show show" id=${showInfo.show.id}>`;
    codeHTML += `<img class="js-img-show img-show" src = ${getImage (showInfo)} alt='no image found'>`;
    codeHTML += `<p class="js-img-name img-name">${showInfo.show.name}</p>`;
    codeHTML += `</li class="js-show show">`;
  }
  showsList.innerHTML = codeHTML;

  const showLiList = document.querySelectorAll ('.js-show');
  for (let showLi of showLiList) {
    showLi.addEventListener ('click', colorAndFavShow);
  }
}

function colorAndFavShow (event) {
  const selectShow = event.currentTarget;
  selectShow.classList.toggle ('favorite-color');
  addOrRemoveFavorites (event);
  console.log (favorites);
}

function addOrRemoveFavorites (event) {
  const clickedShowId = parseInt (event.currentTarget.id);
  const show = shows.find (showItem => showItem.show.id === clickedShowId);
  const showIndex = favorites.indexOf (show);
  console.log (show);
  console.log (favorites);
  if (showIndex === -1) {
    console.log ('no encontrado');
    favorites.push (show);
  } else {
    console.log ('encontrado');
    favorites.splice (showIndex, 1);
  }
  localStorage.setItem ('favorites', JSON.stringify (favorites));
  printShowsFavorites ();
}

function printShowsFavorites () {
  favorites = JSON.parse (localStorage.getItem ('favorites'));
  if (favorites === null) {
    favorites = [];
  }
  let codeFavoritesHTML = '';
  for (let favorite of favorites) {
    codeFavoritesHTML += `<li class="js-show show" id=${favorite.show.id}>`;
    codeFavoritesHTML += `<img class="js-img-show img-show" src = ${getImage (favorite)} alt='no image found'>`;
    codeFavoritesHTML += `<p class="js-img-name img-name">${favorite.show.name}</p>`;
    codeFavoritesHTML += `</li class="js-show show">`;
  }
  favoriteList.innerHTML = codeFavoritesHTML;
}

printShowsFavorites ();
searchButton.addEventListener ('click', clickButton);
