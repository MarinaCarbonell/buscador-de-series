'use strict';

//global variables
let shows = [];
let favorites = [];

const apiUrl = 'http://api.tvmaze.com/search/shows?q=';
const urlNullShowImage =
  'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
const searchButton = document.querySelector ('.js-search-btn');
const searchInput = document.querySelector ('.js-input-movie');
const showsList = document.querySelector ('.js-list-movies');
const favoriteList = document.querySelector ('.list-fav-movie');
const favTitle = document.querySelector ('.js-fav-tittle');

//handle click & fetch
function clickSearchButtonHandler () {
  fetch (apiUrl + searchInput.value)
    .then (function (response) {
      return response.json ();
    })
    .then (function (data) {
      shows = data;
      printShows ();
      errorShow ();
    });
}

//image show function
const getImage = showInfo => {
  if (showInfo.show.image === null) {
    return urlNullShowImage;
  } else {
    return showInfo.show.image.medium;
  }
};

//function for find favorite in favorite list using ID
const findFavorite = id => {
  return favorites.find (favorite => favorite.show.id === id);
};

//handler for include background color and include or eliminate to favorite list when the show is clicked
const handleClickShow = event => {
  const selectShow = event.currentTarget;
  selectShow.classList.toggle ('favorite-color');

  addOrRemoveFavorites (event);
};

//function listener for include an event click in each li show
const listenShowsClicks = () => {
  const showLiList = document.querySelectorAll ('.js-show');
  for (let showLi of showLiList) {
    showLi.addEventListener ('click', handleClickShow);
  }
};

function errorShow () {
  const errorShowText = document.querySelector ('.js-error-show');
  if (shows.length === 0) {
    errorShowText.classList.remove ('hidden');
  } else {
    errorShowText.classList.add ('hidden');
  }
}

//function for create and inlcude the li's in the lu for shows
function printShows () {
  let codeHTML = '';
  for (let showInfo of shows) {
    const favorite = findFavorite (showInfo.show.id);
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

  //include here because it starts being when the li are included with the innerHTML
  listenShowsClicks ();
}

//include the favorite in the ls
const updateLocalStorage = () => {
  localStorage.setItem ('favorites', JSON.stringify (favorites));
};

//inclde in the global let favorites the favorites in the ls
const getFromLocalStorage = () => {
  const data = JSON.parse (localStorage.getItem ('favorites'));
  if (data !== null) {
    favorites = data;
  }
};

//find the show with the ID
function findShow (clickedShowId) {
  return shows.find (showItem => showItem.show.id === clickedShowId);
}

/*find the show and the favorite and include or remove it if is or not in the fav list. Also, it actualice the ls and print favorites again*/

function addOrRemoveFavorites (event) {
  const clickedShowId = parseInt (event.currentTarget.id);
  const show = findShow (clickedShowId);
  const favorite = findFavorite (clickedShowId);
  if (favorite === undefined) {
    favorites.push (show);
  } else {
    favorites.splice (favorites.indexOf (favorite), 1);
  }
  updateLocalStorage ();
  printShowsFavorites ();
}

//function for inlcude the li's in the lu for favorites and print the fav are still in the fav list when the web is open again
function printShowsFavorites () {
  getFromLocalStorage ();

  let codeFavoritesHTML = '';
  for (let favorite of favorites) {
    codeFavoritesHTML += `<li class="js-favorite-show favorite-show">`;
    codeFavoritesHTML += `<div class="js-img-div img-div">`;
    codeFavoritesHTML += `<img class="js-img-favorite-show img-favorite-show" src = ${getImage (favorite)} alt='no image found'> `;
    codeFavoritesHTML += `<i class="far fa-times-circle times-circle" id=${favorite.show.id}></i>`;
    codeFavoritesHTML += `</div>`;
    codeFavoritesHTML += `<p class="js-show-name show-name">${favorite.show.name}</p>`;
    codeFavoritesHTML += `</li>`;
  }
  //button remove all
  if (favorites.length > 0) {
    codeFavoritesHTML += `<button class="js-remove-all-btn remove-all-btn">Borrar todas <i class="fas fa-trash trash"></i></button>`;
  }
  favoriteList.innerHTML = codeFavoritesHTML;

  //title
  if (favorites.length > 0) {
    favTitle.classList.remove ('hidden');
  } else {
    favTitle.classList.add ('hidden');
  }

  listenButtonRemoveFavorite ();
  listenRemoveAll ();
}

//event click for cross button
function listenButtonRemoveFavorite () {
  const removeButtons = document.querySelectorAll ('.times-circle');
  for (let removeButton of removeButtons) {
    removeButton.addEventListener ('click', handlerClickRemoveFav);
  }
}

//transform the id in a int, find the favorite object in the fav list and include it in a const and delete the favorite form the favorites list
function handlerClickRemoveFav (event) {
  const clickedShowId = parseInt (event.currentTarget.id);
  const favorite = findFavorite (clickedShowId);
  favorites.splice (favorites.indexOf (favorite), 1);

  updateLocalStorage ();
  printShowsFavorites ();
  printShows ();
}

//function listener remove button
function listenRemoveAll () {
  if (favorites.length > 0) {
    const removeAllButton = document.querySelector ('.js-remove-all-btn');
    removeAllButton.addEventListener ('click', handlerClickRemoveAll);
  }
}

//function handler remove all button
function handlerClickRemoveAll () {
  favorites = [];
  updateLocalStorage ();
  printShowsFavorites ();
  printShows ();
}

//function for execute clickSearchButtonHandler when click enter
searchInput.addEventListener ('keyup', function (event) {
  if (event.keyCode === 13) {
    clickSearchButtonHandler ();
  }
});

//here because we want print favorites in the list when the web is reloaded
printShowsFavorites ();

searchButton.addEventListener ('click', clickSearchButtonHandler);
