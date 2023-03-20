import { API_URL, KEY, RES_PER_PAGE } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

///////////////////////////////////////////////////////////////////////////////////////////////////
// The Application data
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    currentPage: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

///////////////////////////////////////////////////////////////////////////////////////////////////
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    publisher: recipe.publisher,
    title: recipe.title,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

///////////////////////////////////////////////////////////////////////////////////////////////////
export const loadRecipe = async function (id) {
  try {
    // getting recipe data
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // storing data into the state object
    state.recipe = createRecipeObject(data);

    // check if the new comming recipe exist in bookmarks array or not
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      // if exists set property bookmarked:true
      state.recipe.bookmarked = true;
    // if does NOT exist set property bookmarked:false
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////
export const loadSearchResults = async function (query) {
  try {
    // getting search data
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // storing data into the state object
    state.search.query = query;
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        publisher: rec.publisher,
        title: rec.title,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // to start each search results from page 1
    state.search.currentPage = 1;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////
export const getSearchResultsPage = function (page = state.search.currentPage) {
  // updating the currentPage value in state object
  state.search.currentPage = page;

  // calculating range of the search results
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  // returning part of search results per current page
  return state.search.results.slice(start, end);
};

///////////////////////////////////////////////////////////////////////////////////////////////////
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQt = oldQt * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

///////////////////////////////////////////////////////////////////////////////////////////////////
const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

///////////////////////////////////////////////////////////////////////////////////////////////////
export const addBookmark = function (recipe) {
  // add recipe to bookmarks array
  state.bookmarks.push(recipe);

  // mark current recipe as bookmarked and set bookmarked property to true
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // add to localStorage
  storeBookmarks();
};

///////////////////////////////////////////////////////////////////////////////////////////////////
export const deleteBookMark = function (id) {
  // remove the recipe fro bookmarks array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as NOT bookmarked and change bookmarked property to false
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // add to localStorage
  storeBookmarks();
};

///////////////////////////////////////////////////////////////////////////////////////////////////
const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

///////////////////////////////////////////////////////////////////////////////////////////////////
export const uploadRecipe = async function (newRecipe) {
  try {
    // creating ingredients array from ingredients inputs
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        const [quantity, unit, description] = ingArr;

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredients format! please use the correct format (quantity,unit,description)'
          );

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // convert the form data to API format property names
    const recipe = {
      publisher: newRecipe.publisher,
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    // sending the post request and recieve the data back
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    // storing data into the state object
    state.recipe = createRecipeObject(data);

    // bookmark the recipe
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
