import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Search, { defaultState as defaultSearchResult } from '../Search';

const cities = [
  {
    city: 'Helsinki',
    country: 'Suomi',
    population: 652267,
  },
  {
    city: 'Tukholma',
    country: 'Ruotsi',
    population: 923516,
  }
];

const onSearch = jest.fn();

describe('Search-komponentti', () => {
  test('tulee näkyviin', () => {
    const { getByRole } = render(
      <Search cities={cities} onSearch={onSearch} />
    );

    expect(getByRole('button')).toHaveClass('searchButton');
    expect(getByRole('listbox')).toHaveClass('countrySelector');
  });

  test.each([
    ['hakutermillä', 'searchField', 'searchTerm', 'test'],
    ['vähimmäisväkiluvulla', 'populationMin', 'populationMin', Number(1000).toLocaleString('fi-FI')],
    ['enimmäisväkiluvulla', 'populationMax', 'populationMax', Number(1000).toLocaleString('fi-FI')],
  ])('hakee annetulla %s', (label, fieldId, key, input) => {
    const { getByRole, getByTestId } = render(
      <Search cities={cities} onSearch={onSearch} />
    );

    const inputField = getByTestId(fieldId);
    const searchButton = getByRole('button');

    fireEvent.change(inputField, { target: { value: input } });
    fireEvent.click(searchButton);

    const searchResult = {
      ...defaultSearchResult,
      [key]: input
    };

    expect(onSearch).toHaveBeenCalledWith(searchResult);
  });

  test('hakee valitulla maalla', () => {
    const { getByRole } = render(
      <Search cities={cities} onSearch={onSearch} />
    );

    const selectedCountry = cities[0].country;
    fireEvent.change(getByRole('listbox'), { target: { value: selectedCountry } });
    const searchButton = getByRole('button');
    fireEvent.click(searchButton);

    const searchResult = {
      ...defaultSearchResult,
      selectedCountry
    };

    expect(onSearch).toHaveBeenCalledWith(searchResult);
  });

  test('hakee kaikilla annetuilla arvoilla', () => {
    const { getByRole, getByTestId } = render(
      <Search cities={cities} onSearch={onSearch} />
    );

    const selectedCountry = cities[0].country;
    const searchButton = getByRole('button');
    const searchTerm = getByTestId('searchField');
    const populationMin = getByTestId('populationMin');
    const populationMax = getByTestId('populationMax');
    const textValue = 'test';
    const numericValue = Number(1000).toLocaleString('fi-FI');

    fireEvent.change(searchTerm, { target: { value: textValue } });
    fireEvent.change(populationMin, { target: { value: numericValue } });
    fireEvent.change(populationMax, { target: { value: numericValue } });
    fireEvent.change(getByRole('listbox'), { target: { value: selectedCountry } });
    fireEvent.click(searchButton);

    const searchResult = {
      searchTerm: textValue,
      populationMin: numericValue,
      populationMax: numericValue,
      selectedCountry
    };

    expect(onSearch).toHaveBeenCalledWith(searchResult);
  });

  // Numeroiden käsittely?

  // "Virheellinen valinta SELECTissä"

});