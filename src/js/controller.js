import 'core-js/stable'; //              polyfiling
import 'regenerator-runtime/runtime'; // polyfiling async/await
import * as model from './model.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import AddRecipeView from './views/addRecipeView.js';
import addRecipeView from './views/addRecipeView.js';
import {MODAL_CLOSE_SEC} from './config.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2    e508be65-6285-4e7a-b89f-cf3c25a1384f

/////////////////////////////////////

const controlRecepies = async function () {
  try {
    const id = window.location.hash.slice(1);
    //console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    //update results view
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. loading recipe
    await model.loadRecipe(id);

    //2. rendering recipe
    recipeView.render(model.state.recipe);
    //controlServing();   just for test
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2. load search results
    await model.loadSearchResults(query);
    //resultsView.render(model.state.search.results);

    //3. Render results
    resultsView.render(model.getSearchResultsPage());

    //4. render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (e) {
    console.error(e);
  }
};

const controlPagination = function (goToPage) {
  // console.log(`pag controller: ${goToPage}`);
  //1. render new page
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4. render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  // update recipe servings
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);

  // update view
};

const controlAddBookmark = function () {
  // add or remove bookmark

  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // update recipe view
  // console.log(model.state.bookmarks);
  recipeView.update(model.state.recipe);
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {    // if error ocures in model we can render error with views
    
    // show loading

    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    // succes message
    addRecipeView.renderMessage();

    ///render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in  URL
    // will change parameters without reloading the window
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    //close form window
    setTimeout(function() {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000 );
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecepies);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  
};

init();
