import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();

  const searchQuery = e.target.value.trim();

  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  if (searchQuery.trim() === '') {
    return;
  } else if (!/^[a-zA-Z]*$/.test(searchQuery)) {
    Notiflix.Notify.failure('Please enter a valid country name.');
    return;
  }

  fetchCountries(searchQuery).then(renderCountryCard).catch(handleFetchError);
}

function renderCountryCard(countries) {
  if (countries.length > 10) {
    onFetchError();
  } else if (countries.length >= 2 && countries.length <= 10) {
    renderCountryList(countries);
  } else if (countries.length === 1) {
    renderCountryDetails(countries[0]);
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(
      country =>
        `<li class="country-item">
          <img class="country-flag" src="${country.flag}" alt="Flag of ${country.officialName}" />
          ${country.officialName}
        </li>`
    )
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderCountryDetails(singleCountry) {
  const languages = Object.values(singleCountry.languages).join(', ');
  const markup = `
    <div class="country-details">
      <img class="country-flag" src="${singleCountry.flag}" alt="Flag of ${singleCountry.officialName}" />
      <h2>${singleCountry.officialName}</h2>
      <p>Population: ${singleCountry.population}</p>
      <p>Capital: ${singleCountry.capital}</p>
      <p>Languages: ${languages}</p>
    </div>
  `;
  refs.countryInfo.innerHTML = markup;
}

function onFetchError() {
  Notiflix.Notify.failure(
    'Too many matches found. Please enter a more specific name.'
  );
}

function handleFetchError(error) {
  if (error.message === 'Not found') {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  } else {
    Notiflix.Notify.failure(
      'An error occurred while fetching country data. Please try again later.'
    );
  }
}
