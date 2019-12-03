import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import City from '../City';

const props = {
  city: 'Helsinki',
  country: 'Suomi',
  population: 652267,
};

describe('Kaupunki elementti', () => {
  test('tuo kaupungin nimen näkyviin', async () => {
    const { getByText } = render(<City {...props} />);
    const city = getByText(props.city, { exact: false });
    expect(city).toBeInTheDocument();
  });

  test('tuo valtion nimen näkyviin', async () => {
    const { getByText } = render(<City {...props} />);
    const country = getByText(props.country, { exact: false });
    expect(country).toBeInTheDocument();
  });

  test('klikatessa tuo asukasluvun näkyviin', async () => {
    const { getByText } = render(<City {...props} />);
    const city = getByText(props.city, { exact: false });
    fireEvent.click(city);
    const population = getByText('Asukasluku', { exact: false });
    expect(population).toBeInTheDocument();
  });

  test('kahdesti klikatessa tuo asukasluvun näkyviin ja piilottaa asukasluvun', async () => {
    const { getByText, queryByText } = render(<City {...props} />);
    const city = getByText(props.city, { exact: false });
    fireEvent.click(city);
    const population = getByText('Asukasluku', { exact: false });
    expect(population).toBeInTheDocument();

    fireEvent.click(city);
    const populationHidden = queryByText('Asukasluku', { exact: false });
    expect(populationHidden).toBeNull();
  });

  test('kolmesti klikatessa tuo asukasluvun näkyviin, piilottaa asukasluvun ja tuo asukasluvun uudestaan näkyviin', async () => {
    const { getByText, queryByText } = render(<City {...props} />);
    const city = getByText(props.city, { exact: false });
    // Näkyviin
    fireEvent.click(city);
    const population = getByText('Asukasluku', { exact: false });
    expect(population).toBeInTheDocument();

    // Piiloon
    fireEvent.click(city);
    const populationHidden = queryByText('Asukasluku', { exact: false });
    expect(populationHidden).toBeNull();

    // Näkyviin
    fireEvent.click(city);
    const populationVisible = getByText('Asukasluku', { exact: false });
    expect(populationVisible).toBeInTheDocument();
    expect(population).toStrictEqual(populationVisible);
  });

});