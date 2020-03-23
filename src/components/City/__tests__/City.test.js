import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import City, { formatPopulation } from '../City';

const props = {
  city: 'Helsinki',
  country: 'Suomi',
  population: 652267,
};

describe('City-komponentti', () => {
  test('tuo kaupungin nimen näkyviin', () => {
    const { getByText } = render(<City {...props} />);
    const city = getByText(props.city, { exact: false });
    expect(city).toBeInTheDocument();
  });

  test('tuo maan nimen näkyviin', () => {
    const { getByText } = render(<City {...props} />);
    const country = getByText(props.country, { exact: false });
    expect(country).toBeInTheDocument();
  });

  test('klikatessa tuo asukasluvun näkyviin', () => {
    const { getByText } = render(<City {...props} />);
    const city = getByText(props.city, { exact: false });
    fireEvent.click(city);
    const population = getByText(formatPopulation(props.population), {
      exact: false,
    });
    expect(population).toBeInTheDocument();
  });

  test('kahdesti klikatessa tuo asukasluvun näkyviin ja piilottaa asukasluvun', () => {
    const { getByText, queryByText } = render(<City {...props} />);
    const city = getByText(props.city, { exact: false });
    fireEvent.click(city);
    const population = getByText(formatPopulation(props.population), {
      exact: false,
    });
    expect(population).toBeInTheDocument();

    fireEvent.click(city);
    const populationHidden = queryByText(formatPopulation(props.population), {
      exact: false,
    });
    expect(populationHidden).toBeNull();
  });

  test('kolmesti klikatessa tuo asukasluvun näkyviin, piilottaa asukasluvun ja tuo asukasluvun uudestaan näkyviin', () => {
    const { getByText, queryByText } = render(<City {...props} />);
    const city = getByText(props.city, { exact: false });
    // Näkyviin
    fireEvent.click(city);
    const population = getByText(formatPopulation(props.population), {
      exact: false,
    });
    expect(population).toBeInTheDocument();

    // Piiloon
    fireEvent.click(city);
    const populationHidden = queryByText(formatPopulation(props.population), {
      exact: false,
    });
    expect(populationHidden).toBeNull();

    // Näkyviin
    fireEvent.click(city);
    const populationVisible = getByText(formatPopulation(props.population), {
      exact: false,
    });
    expect(populationVisible).toBeInTheDocument();
    expect(population).toStrictEqual(populationVisible);
  });
});
