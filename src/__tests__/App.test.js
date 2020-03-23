import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App, { sanitizeWord, sanitizeNumber } from '../App';

const actions = require('../actions');
const cities = [
  {
    city: 'Linköping',
    country: 'Ruotsi',
    population: 104232,
  },
  {
    city: 'Jönköping',
    country: 'Ruotsi',
    population: 89396,
  },
  {
    city: 'Helsinki',
    country: 'Suomi',
    population: 652267,
  },
];
jest.spyOn(actions, 'dataFetch').mockImplementation(() => cities);

const specialCharactes = '!"#¤%&/()=?`@£$€{[]}\\*^¨_:;,.<>+';

describe('Kaupunkihaku ohjelma', () => {
  test('tulee näkyviin', () => {
    const { getByText } = render(<App />);
    expect(getByText('Kaupunkihaku')).toBeInTheDocument();
  });

  test('sisältää hakukomponentin', () => {
    const { getByPlaceholderText } = render(<App />);
    expect(getByPlaceholderText('Hakutermi')).toBeInTheDocument();
  });

  test('näyttää kaikki kaupungit oletusarvoisesti', () => {
    const { getByText } = render(<App />);
    cities.forEach(({ city }) =>
      expect(getByText(city, { exact: false })).toBeInTheDocument()
    );
  });

  test('näyttää kaupungit valitun maan perusteella', () => {
    const { getByTestId, getByText, queryByText } = render(<App />);

    const selectedCountry = 'Suomi';
    fireEvent.change(getByTestId('countrySelector'), {
      target: { value: selectedCountry },
    });
    const searchButton = getByText('Hae');
    fireEvent.click(searchButton);

    const foundCities = cities.filter(({ city, country }) => {
      const sameCountry = country === selectedCountry;
      if (sameCountry) {
        expect(getByText(city, { exact: false })).toBeInTheDocument();
        return true;
      } else {
        expect(queryByText(city, { exact: false })).toBeNull();
        return false;
      }
    });

    expect(foundCities).toHaveLength(1);
  });

  test.each([
    ['näyttää kaupungit hakutermin perusteella', 'Hakutermi', 'ping', 2],
    [
      'ei näytä kaupunkeja väärän hakutermin perusteella',
      'Hakutermi',
      'Lorem ipsum',
      0,
    ],
    ['näyttää kaupungit vähimmäisväkiluvun perusteella', 'Vähintään', 1, 3],
    [
      'ei näytä kaupunkeja väärän vähimmäisväkiluvun perusteella',
      'Vähintään',
      10000000,
      0,
    ],
    [
      'näyttää kaupungit enimmäisväkiluvun perusteella',
      'Enintään',
      10000000,
      3,
    ],
    [
      'ei näytä kaupunkeja väärän enimmäisväkiluvun perusteella',
      'Enintään',
      1,
      0,
    ],
  ])('%s', (header, placeholder, input, expextedFoundCities) => {
    const { getByText, queryByText, getByPlaceholderText } = render(<App />);

    const inputField = getByPlaceholderText(placeholder);
    const searchButton = getByText('Hae');
    fireEvent.change(inputField, { target: { value: input } });
    fireEvent.click(searchButton);

    const foundCities = cities.filter(({ city, country, population }) => {
      let containsSearchTerm = null;

      switch (placeholder) {
        case 'Hakutermi':
          containsSearchTerm = [city, country].some(text =>
            text.includes(input)
          );
          break;
        case 'Vähintään':
          containsSearchTerm = input < population;
          break;
        case 'Enintään':
          containsSearchTerm = population < input;
          break;
      }

      expect(containsSearchTerm).not.toBe(null);

      if (containsSearchTerm) {
        expect(getByText(city, { exact: false })).toBeInTheDocument();
        return true;
      } else {
        expect(queryByText(city, { exact: false })).toBeNull();
        return false;
      }
    });

    expect(foundCities).toHaveLength(expextedFoundCities);
  });

  test('funktio sanitizeWord suodattaa erikoismerkit pois', () => {
    const expected = 'test';
    expect(
      sanitizeWord(
        `${specialCharactes}t${specialCharactes}es${specialCharactes}t`
      )
    ).toBe(expected);
  });

  test('funktio sanitizeNumber suodattaa muut merkit paitsi numerot pois', () => {
    const expected = 678;
    expect(sanitizeNumber(`6${specialCharactes}7Lorem Ipsum8`)).toBe(expected);
  });
});
