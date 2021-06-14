import View from './View.js';
import icons from 'url:../../img/icons.svg';
import PreviewView from './previewView';

class ResaultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No results found, Try again!';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResaultsView();
