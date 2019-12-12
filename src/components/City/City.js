import React from 'react';
import './City.css';
import PropTypes from 'prop-types';

export default class City extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false
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
        <div className='title'>{`${city}, ${country} `}</div>
        {this.state.open &&
          <div className='population'>
            Asukasluku: {population.toLocaleString('fi-FI')}
          </div>
        }
      </div>
    );
  }
}

City.propTypes = {
  city: PropTypes.string,
  country: PropTypes.string,
  population: PropTypes.number,
};