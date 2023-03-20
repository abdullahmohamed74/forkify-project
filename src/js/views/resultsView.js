import previewView from './previewView.js';
import View from './view.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'we could NOT find any recipes for that query. please try another one!';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
