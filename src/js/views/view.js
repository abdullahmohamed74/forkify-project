export default class View {
  /**
   * render the recieved object to the DoM
   * @param {object| object[]} data the data to be rendered
   * @param {boolean} [render = true] if false return markup string instead of render it to the DOM
   * @returns {undefined | string} returns a markup string if render is false
   * @this {object} view instance
   * @author Abdullah Mohamed
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const markup = this._generateMarkup();

    // create new DOM that stored in the memory
    const newDOM = document.createRange().createContextualFragment(markup);

    // selecting all new elements from the new DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // // selecting all current elements from the current DOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updating the changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updating the changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attribute => {
          curEl.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
              <div class="spinner">
                <svg>
                  <use href="src/img/icons.svg#icon-loader"></use>
                </svg>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
              <div class="error">
                <div>
                  <svg>
                    <use href="src/img/icons.svg#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div> 
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
            <div class="message">
              <div>
                <svg>
                  <use href="src/img/icons.svg#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
