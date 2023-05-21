import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';
// import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const countryCard = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    event.preventDefault();
    
    const searchQuery = inputEl.value.trim();
    
    fetchCountries(searchQuery)
    .then(data => {
        renderCountryCard(data);
    })
    .catch(error => {
        console.log(error);
    });
};

function fetchCountries(name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name.official,capital,population,flags.svg,languages`).then(
        response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        }
        )
    };
    
function renderCountryCard(country) {
    const markup = country
        .reduce((acc, { name: { official }, capital, population, flags, languages }) => {
            languages = Object.values(languages).join(', ');
            return (acc + `<h2 class="post-title">${official}</h2>
                <img src="${flags.svg}" width="100" alt="name"/>
                <p><b>Capital</b>: ${capital}</p>
                <p><b>Population</b>: ${population}</p>
                <p><b>Languages</b>${languages}</p>`);
        }, '');
    countryCard.innerHTML = markup;
};

function renderCountryList(countries) {
    const markupEl = countries
        .map(({ name, flags }) => {
        return `<li>
                <h2 class="post-title">${name.official}</h2>
                <img src="${flags.svg}" width="200" alt="name"/>
                </li>`;
    })
        .join('');
    countryList.innerHTML = markupEl;
}