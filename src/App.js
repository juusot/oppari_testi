import React from 'react';
import './App.css';
import Search from './components/Search';
import City from './components/City';
import { dataFetch } from './actions.js';

export function sanitizeWord(word) {
  return word.replace(/[!"#¤%&/()=?`@£$€{[\]}\\*^¨_:;,.<>+\s]+/g, '').toLowerCase();
}

export function sanitizeNumber(text) {
  return Number(String(text).replace(/[^0-9]+/g, ''));
}

export function filterCityData(filterData, cities) {
  return filterData
    ? cities
        .filter(({ country }) => (filterData.selectedCountry ? filterData.selectedCountry === country : true))
        .filter(({ country, city }) =>
          filterData.searchTerm ? sanitizeWord(`${city}${country}`).includes(sanitizeWord(filterData.searchTerm)) : true
        )
        .filter(({ population }) =>
          filterData.populationMin ? sanitizeNumber(filterData.populationMin) < sanitizeNumber(population) : true
        )
        .filter(({ population }) =>
          filterData.populationMax ? sanitizeNumber(filterData.populationMax) > sanitizeNumber(population) : true
        )
    : cities;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: this.getData(),
      filterData: null,
    };
  }

  getData() {
    return dataFetch().sort((a, b) => (a.city > b.city ? 1 : -1));
  }

  render() {
    const { cities, filterData } = this.state;
    const filteredCities = filterCityData(filterData, cities);

    return (
      <React.Fragment>
        <h1>Kaupunkihaku</h1>
        <Search
          countries={[...new Set(cities.map(({ country }) => country))].sort()}
          onSearch={data => this.setState({ filterData: data })}
        />
        {filteredCities.map(props => (
          <City key={props.city} {...props} />
        ))}
      </React.Fragment>
    );
  }
}
