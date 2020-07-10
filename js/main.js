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
const favoriteColor = document.querySelector ('.favorite-color');

function clickButton () {
  fetch (apiUrl + searchInput.value)
    .then (function (response) {
      return response.json ();
    })
    .then (function (data) {
      console.log (data);
      printShows (data);
    });
}

function getImage (showInfo) {
  if (showInfo.show.image === null) {
    return urlNullShowImage;
  } else {
    return showInfo.show.image.medium;
  }
}

function printShows (shows) {
  let acc = '';
  for (let showInfo of shows) {
    acc += `<li class="js-show show">`;
    acc += `<img class=js-img-show img-show src = ${getImage (showInfo)} alt='no image found'>`;
    acc += `<p class=js-img-name img-name>${showInfo.show.name}</p>`;
    acc += `</li class="js-show show">`;
  }
  showsList.innerHTML = acc;
}

searchButton.addEventListener ('click', clickButton);
