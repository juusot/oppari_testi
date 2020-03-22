import React from 'react';
import './Search.css';
import PropTypes from 'prop-types';

export const defaultState = {
  populationMin: '',
  populationMax: '',
  selectedCountry: '',
  searchTerm: '',
};

export const formatPopulation = population => Number(population).toLocaleString('fi-FI');

export default class Search extends React.Component {
  constructor() {
    super();
    this.state = defaultState;
  }

  handleOnChange(key) {
    return event => {
      const value =
        ['populationMin', 'populationMax'].includes(key) && event.target.value
          ? formatPopulation(event.target.value.replace(/[^0-9]+/g, ''))
          : event.target.value;

      this.setState({ [key]: value });
    };
  }

  render() {
    const { searchTerm, selectedCountry, populationMin, populationMax } = this.state;

    return (
      <div className="search">
        <div className="textFilter">
          <input
            className="searchTerm"
            data-testid="searchTerm"
            placeholder="Hakutermi"
            type="text"
            onChange={this.handleOnChange('searchTerm')}
            defaultValue={searchTerm}
          />
          <button
            data-testid="searchButton"
            className="searchButton"
            type="button"
            onClick={() => this.props.onSearch(this.state)}
          >
            Hae
          </button>
        </div>
        <div className="countryFilter">
          <h4>Maat</h4>
          <select
            data-testid="countrySelector"
            className="countrySelector"
            onChange={this.handleOnChange('selectedCountry')}
            defaultValue={selectedCountry}
          >
            <option key="default" value="">
              Valitse maa
            </option>
            {this.props.countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="populationFilter">
          <h4>Väkiluku</h4>
          <input
            className="populationInput min"
            data-testid="populationMin"
            placeholder="Vähintään"
            type="text"
            onChange={this.handleOnChange('populationMin')}
            value={populationMin}
          />
          <input
            className="populationInput max"
            data-testid="populationMax"
            placeholder="Enintään"
            type="text"
            onChange={this.handleOnChange('populationMax')}
            value={populationMax}
          />
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  countries: PropTypes.array,
  onSearch: PropTypes.func,
};
