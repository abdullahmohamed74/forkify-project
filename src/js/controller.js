import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { CLOSE_MODAL_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////////////////////////////////////////////////////////////

const controlRecipe = async function () {
  try {
    // getting the id
    const id = window.location.hash.slice(1);

    // guard clause
    if (!id) return;

    // renderSpinner before render recipe data
    recipeView.renderSpinner();

    // 0- updating results view to marke selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1-updating bookmark list
    bookmarkView.update(model.state.bookmarks);

    // 2- loading the recipe
    await model.loadRecipe(id);

    // 3- rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // handling error message
    recipeView.renderError();
    console.error(err);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////
const controlSearchResults = async function () {
  try {
    // getting search word
    const query = searchView.getQuery();

    // guard clause
    if (!query) return;

    // renderSpinner before render search data
    resultsView.renderSpinner();

    // 1- loading search results
    await model.loadSearchResults(query);

    // 2- rendering only the first 10 search results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 3- rendering pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////
const controlPagination = function (gotoPage) {
  // 2- rendering NEW search results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // 3- rendering NEW pagination
  paginationView.render(model.state.search);
};

//////////////////////////////////////////////////////////////////////////////////////////////
const controlUpdateServings = function (newServings) {
  // update sevings and ingredients in the state
  model.updateServings(newServings);

  // render new recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//////////////////////////////////////////////////////////////////////////////////////////////
const cotrolAddBookmark = function () {
  // add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  // updata the recipeView to show the bookmark
  recipeView.update(model.state.recipe);

  // render bookmarks when clicking on bookmark btn
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  // render bookmarks when page reloads
  bookmarkView.render(model.state.bookmarks);
};

//////////////////////////////////////////////////////////////////////////////////////////////
const controlAddRecipe = async function (newRecipe) {
  try {
    // render the spinner
    addRecipeView.renderSpinner();

    // upload the recipe
    await model.uploadRecipe(newRecipe);

    // render the recipe
    recipeView.render(model.state.recipe);

    // render success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close the modal window
    setTimeout(function () {
      addRecipeView.togglewindow();
    }, CLOSE_MODAL_SEC * 1000);

  } catch (err) {
    // console.error(err);
    addRecipeView.renderError(err.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////
(function () {
  // the publisher - subscriber pattern
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateRecipe(controlUpdateServings);
  recipeView.addHandlerAddBookmark(cotrolAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('pop');
})();
