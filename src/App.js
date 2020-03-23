import React from 'react';
import './App.css';
import Search from './components/Search';
import City from './components/City';
import { dataFetch } from './actions.js';

export function sanitizeWord(word) {
  return word
    .replace(/[!"#¤%&/()=?`@£$€{[\]}\\*^¨_:;,.<>+\s]+/g, '')
    .toLowerCase();
}

export function sanitizeNumber(text) {
  return Number(String(text).replace(/[^0-9]+/g, ''));
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

    const filteredCities = filterData
      ? cities.filter(({ city, country, population }) => {
          const results = [true];

          if (filterData.selectedCountry) {
            results.push(filterData.selectedCountry === country);
          }

          if (filterData.searchTerm) {
            results.push(
              sanitizeWord(`${city}${country}`).includes(
                sanitizeWord(filterData.searchTerm)
              )
            );
          }

          if (filterData.populationMin) {
            results.push(
              sanitizeNumber(filterData.populationMin) <
                sanitizeNumber(population)
            );
          }

          if (filterData.populationMax) {
            results.push(
              sanitizeNumber(filterData.populationMax) >
                sanitizeNumber(population)
            );
          }

          return results.every(bool => bool);
        })
      : cities;

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
