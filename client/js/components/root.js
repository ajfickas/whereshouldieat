import React from 'react';
import ReactDOM from 'react-dom';

import tomo from '../api/tomo';

class Root extends React.Component {

  constructor() {
    super();

    this.state = {
      mostRelevantPlace: null,
      places: null,
      maybePlaces: {},
      noPlaces: {},
      userCoordinates: null,
      yesPlace: null,
    };
  }

  // Event handling

  handleStartClick() {
    console.log('DEBUG: Root: handleStartClick');
    navigator.geolocation.getCurrentPosition((position) => {
      const userCoordinates = [position.coords.longitude, position.coords.latitude];
      this.setState({
        userCoordinates,
      });

      // Fetch places
      console.log('DEBUG: Root: handleStartClick: fetching places');
      const request = tomo.search({
        center: userCoordinates,
        radius: 16093, // ~10 miles in meters.
        // TODO: tags
      });
      request.promise.then((response) => {
        console.log('DEBUG: Root: handleStartClick: fetched places');
        this.setState({
          places: response.data,
        });
      }, (error) => {
        console.log('Error fetching places: request, error: ', request, error);
      });
    }, (error) => {
      console.log('TODO: Root: handleStartClick: error getting current position: error: ', error);
    });
  }

  // Rendering

  render() {
    if (!this.state.userCoordinates) {
      return this.renderStart();
    } else if (!this.state.places) {
      return this.renderFindingPlaces();
    } else {
      return this.renderApp();
    }
  }

  renderStart() {
    return (
      <div
        onClick={() => {
          this.handleStartClick();
        }}
        role="button"
      >Help me find a place to eat.</div>
    );
  }

  renderFindingPlaces() {
    return (
      <div>Finding places...</div>
    );
  }

  renderApp() {
    return (
      <div>{JSON.stringify(this.state.places)}</div>
      // <div>
      //   <Panel
      //     onMaybe={() => {
      //       console.log('TODO: Root: onMaybe');
      //       // TODO: Add place to maybes and show next most relavant place.
      //     }}
      //     onNo={(place) => {
      //       console.log('TODO: Root: onNo');
      //       // TODO: Add place to nos and show next most relavant place.
      //     }}
      //     onYes={(place) => {
      //       console.log('TODO: Root: onYes');
      //       alert(`${place.name} it is. Enjoy!`);
      //     }}
      //     place={this.state.mostRelevantPlace}
      //   />
      //   <Map
      //     onPlaceClick={() => {
      //       // TODO: Show place in panel
      //     }}
      //     places={this.state.places}
      //     userCoordinates={this.state.userCoordinates}
      //   />
      // </div>
    );
  }
}

export default Root;
