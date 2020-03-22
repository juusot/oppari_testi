import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Search, { defaultState as defaultSearchResult, formatPopulation } from '../Search';

const countries = ['Suomi', 'Ruotsi'];
const onSearch = jest.fn();
const props = { countries, onSearch };

beforeEach(() => {
  onSearch.mockClear();
});

describe('Search-komponentti', () => {
  test('tulee näkyviin', () => {
    const { getByPlaceholderText, getByText } = render(<Search {...props} />);

    expect(getByText('Hae')).toBeInTheDocument();
    expect(getByText('Valitse maa')).toBeInTheDocument();
    expect(getByPlaceholderText('Hakutermi')).toBeInTheDocument();
    expect(getByPlaceholderText('Vähintään')).toBeInTheDocument();
    expect(getByPlaceholderText('Enintään')).toBeInTheDocument();
  });

  test.each([
    ['hakutermillä', 'searchTerm', 'Hakutermi', 'test'],
    ['vähimmäisväkiluvulla', 'populationMin', 'Vähintään', formatPopulation(1000)],
    ['enimmäisväkiluvulla', 'populationMax', 'Enintään', formatPopulation(1000)],
  ])('hakee annetulla %s', (label, key, placeholder, input) => {
    const { getByPlaceholderText, getByText } = render(<Search {...props} />);

    const inputField = getByPlaceholderText(placeholder);
    const searchButton = getByText('Hae');

    fireEvent.change(inputField, { target: { value: input } });
    fireEvent.click(searchButton);

    const searchResult = {
      ...defaultSearchResult,
      [key]: input,
    };

    expect(onSearch).toHaveBeenCalledWith(searchResult);
  });

  test('hakee valitulla maalla', () => {
    const { getByTestId, getByText } = render(<Search {...props} />);

    const selectedCountry = countries[0];
    fireEvent.change(getByTestId('countrySelector'), { target: { value: selectedCountry } });
    const searchButton = getByText('Hae');
    fireEvent.click(searchButton);

    const searchResult = {
      ...defaultSearchResult,
      selectedCountry,
    };

    expect(onSearch).toHaveBeenCalledWith(searchResult);
  });

  test('hakee kaikilla annetuilla yhtaikaa arvoilla', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(<Search {...props} />);

    const selectedCountry = countries[1];
    const searchButton = getByText('Hae');
    const searchTerm = getByPlaceholderText('Hakutermi');
    const populationMin = getByPlaceholderText('Vähintään');
    const populationMax = getByPlaceholderText('Enintään');
    const textValue = 'test';
    const numericValue = formatPopulation(1000);

    fireEvent.change(searchTerm, { target: { value: textValue } });
    fireEvent.change(populationMin, { target: { value: numericValue } });
    fireEvent.change(populationMax, { target: { value: numericValue } });
    fireEvent.change(getByTestId('countrySelector'), { target: { value: selectedCountry } });
    fireEvent.click(searchButton);

    const searchResult = {
      searchTerm: textValue,
      populationMin: numericValue,
      populationMax: numericValue,
      selectedCountry,
    };

    expect(onSearch).toHaveBeenCalledWith(searchResult);
  });
});
