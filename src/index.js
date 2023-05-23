import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const countryCard = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');



inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

let currentRenderFunction = null;

function onSearch(event) {
    event.preventDefault();
    
    const searchQuery = inputEl.value.trim();

    if (searchQuery === '') {
        clearRenderedContent();
        return;
    }

    fetchCountries(searchQuery)
        .then(data => {
            clearRenderedContent();
            
            if (currentRenderFunction) {

                currentRenderFunction = null;
            }

            if (data.length >= 2 && data.length <= 10) {
                currentRenderFunction = renderCountryList;
            } else if (data.length === 1) {
                currentRenderFunction = renderCountryCard;
            } else {
                Notify.info("Too many matches found. Please enter a more specific name.");
                return;
            }
            
            currentRenderFunction(data);
        })
        .catch(error => {
            clearRenderedContent();
            if (error.message = 404) {
                Notify.failure("Oops, there is no country with that name");
            }
            else {
                Notify.failure(error.message);
            }
        });
};

function clearRenderedContent() {
    countryCard.innerHTML = '';
    countryList.innerHTML = '';
};

function renderCountryCard(country) {
    const markup = country
        .reduce((acc, { name, capital, population, flags, languages }) => {
            languages = Object.values(languages).join(', ');
            return (acc + `
                <div class="main-info">
                <img src="${flags.svg}" width="50" alt="name"/>
                <h1 class="country-name">${name.official}</h1>
                </div>
                <p><b>Capital</b>: ${capital}</p>
                <p><b>Population</b>: ${population}</p>
                <p><b>Languages</b>: ${languages}</p>`);
        }, '');
    countryCard.innerHTML = markup;
};

function renderCountryList(countries) {
    const markupEl = countries
        .map(({ name, flags }) => {
        return `<li class="item">
                <img src="${flags.svg}" width="50" alt="name"/>
                <h2 class="country-name">${name.official}</h2>
                </li>`;
    })
        .join('');
    countryList.innerHTML = markupEl;
};