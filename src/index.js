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
  state = {
    center: null,
  };

  handleMapMounted = map => {
    this.map = map;
    this.props.onMapReady && this.props.onMapReady();
  };

  getCamera = () => {
    return {
      zoom: this.map.getZoom(),
      center: this.map.getCenter(),
      heading: this.map.getHeading(),
    };
  };

  animateCamera(camera) {
    this.setState({ zoom: camera.zoom });
    this.setState({ center: camera.center });
  }

  animateToRegion(coordinates, _zoom = this.state.zoom) {
    this.map.panTo({ lat: coordinates.lat, lng: coordinates.lng });

    this.map.zoom = _zoom;
    // this.setState({ center: coordinates });
    // this.setState({ zoom });
  }

  getBounds = () => {
    return this.map.getBounds();
  };

  getViewportBounds = () => {
    const _bounds = this.map.getBounds();

    return {
      ne: _bounds.getNorthEast(),
      sw: _bounds.getSouthWest(),
    };
  };

  onDragEnd = () => {
    const { onRegionChangeComplete } = this.props;
    const { zoom } = this.state;

    if (this.map && onRegionChangeComplete) {
      const center = this.map.getCenter();
      onRegionChangeComplete({
        latitude: 100,
        longitude: center.lng(),
      });
    }
  };

  render() {
    const { region, initialRegion, onRegionChange, onPress, options, defaultZoom } = this.props;
    const { center } = this.state;
    const style = this.props.style || styles.container;

    const googleMapProps = {};
    const zoom =
      defaultZoom ||
      (region && region.latitudeDelta
        ? Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2)
        : initialRegion && initialRegion.latitudeDelta
        ? Math.round(Math.log(360 / initialRegion.latitudeDelta) / Math.LN2)
        : 15);
    googleMapProps['zoom'] = this.state.zoom ? this.state.zoom : zoom;
    return (
      <View style={style}>
        <GoogleMapContainer
          handleMapMounted={this.handleMapMounted}
          containerElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          onZoomChanged={() => {
            this.setState({ zoom: this.map.getZoom() });
          }}
          {...googleMapProps}
          onDragStart={onRegionChange}
          onIdle={this.onDragEnd}
          defaultZoom={zoom}
          onClick={onPress}
          options={options}>
          {this.props.children}
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
