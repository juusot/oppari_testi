import React from 'react';
import './City.css';
import PropTypes from 'prop-types';

export const formatPopulation = population =>
  Number(population).toLocaleString('fi-FI');

export default class City extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { city, country, population } = this.props;
    const className = `city ${this.state.open ? 'open' : ''}`.trim();
    return (
      <div className={className} onClick={() => this.toggle()}>
        <div className="title">{`${city}, ${country} `}</div>
        {this.state.open && (
          <div className="population">
            Asukasluku: {formatPopulation(population)}
          </div>
        )}
      </div>
    );
  }
}

City.propTypes = {
  city: PropTypes.string,
  country: PropTypes.string,
  population: PropTypes.number,
};
