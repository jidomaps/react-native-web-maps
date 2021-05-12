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
    this.setState({ zoom: _zoom });
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

  onMapViewChanged = () => {
    const { onRegionChangeComplete } = this.props;

    const center = this.map.getCenter();
    const zoom = this.map.getZoom();

    if (this.map && onRegionChangeComplete) {
      onRegionChangeComplete({
        lat: center.lat(),
        lng: center.lng(),
        zoom,
      });
    }

    this.setState({ center, zoom });
  };

  getMapComponent() {
    return this.map;
  }

  componentDidMount() {
    console.log('Map View Mounted');
  }

  componentWillUnmount() {
    console.log('Map View UN Mounted');
  }

  render() {
    const {
      region,
      initialRegion,
      onRegionChange,
      onPress,
      options,
      defaultZoom,
      zoom,
    } = this.props;
    const style = this.props.style || styles.container;

    const { center } = this.state;

    return (
      <View style={style}>
        <GoogleMapContainer
          handleMapMounted={this.handleMapMounted}
          containerElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          onZoomChanged={() => {
            this.onMapViewChanged();
          }}
          center={center}
          region={region}
          zoom={zoom}
          onDragStart={onRegionChange}
          onDragEnd={this.onMapViewChanged}
          defaultZoom={defaultZoom}
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
