import View from './view.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // getting the target element
      const btn = e.target.closest('.btn--inline');
      // gaurd clause
      if (!btn) return;

      const goto = +btn.dataset.goto;

      // calling the subscriber
      handler(goto);
    });
  }

  _generateMarkup() {
    const curPage = this._data.currentPage;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page 1 , and there are other pages
    if (curPage === 1 && numOfPages > 1) {
      return `
          <button data-goto='${
            curPage + 1
          }' class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    // last page
    if (curPage === numOfPages && numOfPages > 1) {
      return `
          <button data-goto='${
            curPage - 1
          }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
      `;
    }

    // Other pages
    if (curPage < numOfPages) {
      return `
          <button data-goto='${
            curPage - 1
          }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
          <span>Page ${curPage - 1}</span>
          </button>
        
          <button data-goto='${
            curPage + 1
          }' class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button>
          `;
    }

    // page 1 , and there are NO other pages
    return ``;
  }
}
export default new PaginationView();
