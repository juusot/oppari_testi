import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Search, { defaultState as defaultSearchResult, formatPopulation } from '../Search';

const countries = ['Suomi', 'Ruotsi'];
const onSearch = jest.fn();
const props = { countries, onSearch };

describe('Search-komponentti', () => {
  test('tulee näkyviin', () => {
    const { getByRole, getByTestId } = render(
      <Search {...props} />
    );

    expect(getByRole('button')).toHaveClass('searchButton');
    expect(getByRole('listbox')).toHaveClass('countrySelector');
    expect(getByTestId('searchTerm')).toBeInTheDocument();
    expect(getByTestId('populationMin')).toBeInTheDocument();
    expect(getByTestId('populationMax')).toBeInTheDocument();
  });

  test.each([
    ['hakutermillä', 'searchTerm', 'test'],
    ['vähimmäisväkiluvulla', 'populationMin', formatPopulation(1000)],
    ['enimmäisväkiluvulla', 'populationMax', formatPopulation(1000)],
  ])('hakee annetulla %s', (label, key, input) => {
    const { getByRole, getByTestId } = render(
      <Search {...props} />
    );

    const inputField = getByTestId(key);
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
      <Search {...props} />
    );

    const selectedCountry = countries[0];
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
      <Search {...props} />
    );

    const selectedCountry = countries[1];
    const searchButton = getByRole('button');
    const searchTerm = getByTestId('searchTerm');
    const populationMin = getByTestId('populationMin');
    const populationMax = getByTestId('populationMax');
    const textValue = 'test';
    const numericValue = formatPopulation(1000);

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