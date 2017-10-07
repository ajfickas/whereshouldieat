import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

import tomo from '../api/tomo';

import PlaceContender from './place-contender';

class Root extends React.Component {

  // Lifecycle

  constructor() {
    super();

    this.state = {
      contendingPlace: null,
      maybePlaces: {},
      noPlaces: {},
      places: null,
      resolvingLocation: true,
      userCoordinates: null,
      winningPlace: null,
    };
  }

  componentDidMount() {
    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWpmaWNrYXMiLCJhIjoiY2o4Z2hwM2ZkMGNmYTMzbzZtcmsybjdudyJ9._QpOdx5jMTfsHD1uCKzSOg';
    var map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/light-v9'
    });

    navigator.geolocation.getCurrentPosition((position) => {
      const userCoordinates = [position.coords.longitude, position.coords.latitude];
      this.setState({
        resolvingLocation: false,
        userCoordinates,
      });

      // Fetch places
      const request = tomo.search({
        center: userCoordinates,
        limit: 50,
        radius: 16093, // ~10 miles in meters.
        tags: 'food-drink,!grocery-store',
      });
      request.promise.then((response) => {
        const places = response.data;
        // TODO: DEBUGGING
        window.places = places;
        this.setState({
          contendingPlaceIndex: 0,
          places: places,
        });
      }, (error) => {
        console.log('Error fetching places: request, error: ', request, error);
      });
    }, (error) => {
      this.setState({
        resolvingLocation: false,
      });
    });
  }

  // Event handling

  handleYes(place) {
    this.setState({
      winningPlace: place,
    });
  }

  handleNo(place) {
    const contendingPlaceIndex = this.state.contendingPlaceIndex + 1;
    if (contendingPlaceIndex < this.state.places.length) {
      this.setState({
        contendingPlaceIndex: this.state.contendingPlaceIndex + 1,
      });
    } else {
      throw new Error('Ran out of places to show: contendingPlaceIndex: ', contendingPlaceIndex);
    }
  }

  // Rendering

  render() {
    return (
      <div className="root">
        {this.renderContent()}
      </div>
    );
  };

  renderContent() {
    if (this.state.resolvingLocation) {
      return this.renderFindingLocation();
    } else if (!this.state.places) {
      return this.renderFindingPlaces();
    } else if (this.state.contendingPlaceIndex !== null) {
      return this.renderContendingPlace();
    } else {
      throw new Error('Unknown rendering state');
    }
  }

  renderFindingLocation() {
    return (
      <div className="finding-location">Finding your location...</div>
    );
  }

  renderFindingPlaces() {
    return (
      <div className="finding-places">Finding places...</div>
    );
  }

  renderContendingPlace() {
    const contendingPlace = this.state.places[this.state.contendingPlaceIndex];
    return (
      <PlaceContender
        onNo={(place) => this.handleNo(place)}
        onYes={(place) => this.handleYes(place)}
        place={contendingPlace}
      />
    );
  }
}

export default Root;
