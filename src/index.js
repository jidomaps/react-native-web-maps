import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import Marker from './Marker';
import Polyline from './Polyline';
import Callout from './Callout';

const GoogleMapContainer = withGoogleMap(props => (
  <GoogleMap {...props} ref={props.handleMapMounted} />
));

class MapView extends Component {
  map = null;

  state = {
    center: null,
  };

  getMapComponent() {
    return this.map;
  }

  handleMapMounted = map => {
    const { onMapReady } = this.props;
    this.map = map;

    if (onMapReady) {
      onMapReady();
    }
  };

  onMapViewChanged = isMapPan => {
    const { onRegionChangeComplete } = this.props;

    let _center = {};

    if (isMapPan) {
      _center = this.map.getCenter();
    }

    const zoom = this.map.getZoom();

    if (this.map !== null && _center.lat && onRegionChangeComplete) {
      onRegionChangeComplete(
        {
          latitude: _center.lat(),
          longitude: _center.lng(),
        },
        zoom
      );
    }

    this.setState({
      center: _center,
      zoom,
    });
  };

  getCamera = () => ({
    zoom: this.map.getZoom(),
    center: this.map.getCenter(),
    heading: this.map.getHeading(),
  });

  getBounds = () => this.map.getBounds();

  getViewportBounds = () => {
    if (this.map !== null) {
      const _bounds = this.map.getBounds();

      if (_bounds !== null) {
        return {
          ne: _bounds.getNorthEast(),
          sw: _bounds.getSouthWest(),
        };
      }
    }
    return null;
  };

  animateCamera(camera) {
    this.setState({ zoom: camera.zoom });
    this.setState({ center: camera.center });
  }

  // eslint-disable-next-line react/destructuring-assignment
  animateToRegion(coordinates, _zoom = this.state.zoom) {
    if (this.map !== null) {
      this.map.panTo({ lat: coordinates.lat, lng: coordinates.lng });
      this.setState({ zoom: _zoom });
    }
  }

  render() {
    const {
      children,
      initialRegion,
      onRegionChange,
      onPress,
      options,
      defaultZoom,
      style,
    } = this.props;

    const { center, zoom } = this.state;

    const _style = style || styles.container;

    const mapProps = {
      center,
      zoom,
    };

    return (
      <View style={_style}>
        <GoogleMapContainer
          handleMapMounted={this.handleMapMounted}
          containerElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          onZoomChanged={() => {
            this.onMapViewChanged(false);
          }}
          {...mapProps}
          initialRegion={initialRegion}
          onDragStart={onRegionChange}
          onDragEnd={() => this.onMapViewChanged(true)}
          defaultZoom={defaultZoom}
          onClick={onPress}
          options={options}>
          {children}
        </GoogleMapContainer>
      </View>
    );
  }
}

MapView.Marker = Marker;
MapView.Polyline = Polyline;
MapView.Callout = Callout;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});

export default MapView;
