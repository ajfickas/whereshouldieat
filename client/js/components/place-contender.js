import React from 'react';
import ReactDOM from 'react-dom';

class PlaceContender extends React.Component {

  // Helpers

  getBusinessHours() {
    if (this.props.place.hours) {
      const keys = Object.keys(this.props.place.hours);
      if (keys.length > 0) {
        return this.props.place.hours[keys[0]];
      }
    }
  }

  // Rendering

  render() {
    return (
      <div className="place-contender">
        {this.renderImage()}
        {this.renderRating()}
        {this.renderPriciness()}
        {this.renderName()}
        {this.renderAddress()}
        {this.renderDescription()}
        {this.renderYesButton()}
        {this.renderNoButton()}
      </div>
    );
  }

  renderNoButton() {
    return (
      <div className="no-button" onClick={() => this.props.onNo(this.props.place)} role="button">✗ No, pass.</div>
    );
  }

  renderYesButton() {
    return (
      <div className="yes-button" onClick={() => this.props.onYes(this.props.place)} role="button">✓ Yes, looks good.</div>
    );
  }

  renderName() {
    return (
      <h1 className="name">{this.props.place.name}</h1>
    );
  }

  renderDescription() {
    if (this.props.place.description) {
      return (
        <p className="description">{this.props.place.description}</p>
      );
    } else {
      return (
        <p className="description">(No description)</p>
      );
    }
  }

  renderAddress() {
    const location = this.props.place.locations[0];
    return (
      <address className="address">
        <div>{location.address1}, {location.city}, {location.state} {location.postal_code}</div>
        <div>
          <a href={this.props.place.contact_info.website}>Website</a>
        </div>
      </address>
    );
  }

  // TODO:
  renderHours() {
    const hours = this.getBusinessHours();
    if (hours) {
      return (
        <div>
          {[{
            dayName: 'Sunday',
            dayKey: 'sun_open_close',
          }, {
            dayName: 'Monday',
            dayKey: 'mon_open_close',
          }, {
            dayName: 'Tuesday',
            dayKey: 'tue_open_close',
          }, {
            dayName: 'Wednesday',
            dayKey: 'wed_open_close',
          }, {
            dayName: 'Thursday',
            dayKey: 'thu_open_close',
          }, {
            dayName: 'Friday',
            dayKey: 'fri_open_close',
          }, {
            dayName: 'Saturday',
            dayKey: 'sat_open_close',
          }].map((day) => {
            return this.renderHoursForDay(hours, day)
          })}
        </div>
      );
    }
  }

  // TODO:
  renderHoursForDay(hours, { dayName, dayKey }) {
    return (
      <div key={dayKey}>
        <h4>{dayName}</h4>
        <ul>
          {hours[dayKey].map((timePeriod) => {
            return (
              <li key={`${dayKey}-${timePeriod}`}>{timePeriod}</li>
            );
          })}
        </ul>
      </div>
    );
  }

  renderImage() {
    if (this.props.place.images.length > 0) {
      const image = this.props.place.images[0].sizes.small;
      return (
        <img className="image" height={image.height} src={image.url} width={image.width} />
      );
    } else {
      return (
        <div className="image">(No Image)</div>
      );
    }
  }

  renderPriciness() {
    if (this.props.place.details.price_rating) {
      return (
        <div className="priciness">
          {'$'.repeat(this.props.place.details.price_rating)}
        </div>
      );
    }
  }

  renderRating() {
    if (this.props.place.details.price_rating) {
      const roundedRating = Math.round(this.props.place.engagement.avg_rating);
      return (
        <div className="rating">
          {'★'.repeat(roundedRating)}
          {'☆'.repeat(5 - roundedRating)}
        </div>
      );
    }
  }

  // TODO:
  renderTags() {
    return (
      <div>
        {this.props.place.tags.map((tag) => {
          return tag.name;
        }).join(', ')}
      </div>
    );
  }
}

export default PlaceContender;
