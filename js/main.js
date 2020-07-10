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
    showLi.addEventListener ('click', handleShow);
  }
}

function handleShow (event) {
  const selectShow = event.currentTarget;
  selectShow.classList.toggle ('favorite-color');
  addFavorites (event);
  console.log (favorites);
}

function addFavorites (event) {
  const clickedShowId = parseInt (event.currentTarget.id);
  const show = shows.find (showItem => showItem.show.id === clickedShowId);
  favorites.push (show);
}

searchButton.addEventListener ('click', clickButton);
