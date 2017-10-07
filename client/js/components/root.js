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
    this.mapboxglMap = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/light-v9'
    });
    // TODO: DEBUG
    window.mapboxglMap = this.mapboxglMap;

    navigator.geolocation.getCurrentPosition((position) => {
      const userCoordinates = [position.coords.longitude, position.coords.latitude];
      this.mapboxglMap.addSource('user-coordinates',  {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: userCoordinates,
          },
        },
      });
      this.mapboxglMap.addLayer({
        id: 'user-coordinates',
        source: 'user-coordinates',
        type: 'circle',
      });
      this.mapboxglMap.flyTo({
        center: userCoordinates,
        zoom: 14,
      });
      this.setState({
        resolvingLocation: false,
        userCoordinates,
      });

      // Fetch places
      const request = tomo.search({
        center: userCoordinates,
        limit: 50,
        radius: 8047, // ~5 miles in meters.
        // radius: 16093, // ~10 miles in meters.
        tags: 'food-drink,!grocery-store',
      });
      request.promise.then((response) => {
        const places = response.data;
        // TODO: DEBUGGING
        window.places = places;
        // TODO:
        this.mapboxglMap.addSource('places',  {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: places.map(function (place) {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [
                    place.locations[0].longitude,
                    place.locations[0].latitude
                  ],
                },
                properties: {
                  id: place.id,
                },
              };
            }),
          },
        });
        this.mapboxglMap.addLayer({
          id: 'contending-place',
          source: 'places',
          type: 'symbol',
          filter: ['==', 'id', 'not-a-place'],
          layout: {
            'icon-image': 'restaurant-15',
          },
        });
        this.setState({
          contendingPlaceIndex: 0,
          places: places,
        });
        this.changeContendingPlace(0);
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
      this.changeContendingPlace(contendingPlaceIndex);
    } else {
      throw new Error('Ran out of places to show: contendingPlaceIndex: ', contendingPlaceIndex);
    }
  }

  // Helpers

  changeContendingPlace(contendingPlaceIndex) {
    const contendingPlace = this.state.places[contendingPlaceIndex];
    this.mapboxglMap.setFilter('contending-place', ['==', 'id', contendingPlace.id]);
    this.mapboxglMap.flyTo({
      center: [
        contendingPlace.locations[0].longitude,
        contendingPlace.locations[0].latitude
      ],
      zoom: 14,
    });
    this.setState({
      contendingPlaceIndex: this.state.contendingPlaceIndex + 1,
    });
  }

  // Rendering

  render() {
    return (
      <div className="root">
        {this.renderContent()}
      </div>
    );
  }

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
      <div className="finding-places">Finding places to eat...</div>
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
