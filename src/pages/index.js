import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
//import { Marker } from 'react-leaflet';
import axios from 'axios';

//import { promiseToFlyTo, getCurrentLocation } from 'lib/map';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

const LOCATION = {
  lat: 38.9072,
  lng: -77.0369,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const IndexPage = () => {
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    if ( !map ) return;

    // Attempt to fetch data
    let response;
    try {
      response = await axios.get( 'https://disease.sh/v3/covid-19/countries' );
      console.log( 'Response: ', response );
    } catch ( e ) {
      console.error( 'Error fetching data: ', e );
    }

    // Destructure data
    const { data } = response;
    const hasData = Array.isArray( data ) && data.length > 0;

    // If there is no data (error), return
    if ( !hasData ) return;

    // Transform data to GeoJSON
    const geoJSON = {
      type: 'FeatureCollection',
      features: data.map(( country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;

        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        };
      }),
    };

    // Insert GeoJSON into map
    const geoJSONLayers = new L.GeoJSON( geoJSON );
    geoJSONLayers.addTo( map );
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect,
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings} />

      <Container type="content" className="text-center home-start">
        <h2>Still Getting Started?</h2>
        <p>Run the following in your terminal!</p>
        <pre>
          <code>gatsby new [directory] https://github.com/colbyfayock/gatsby-starter-leaflet</code>
        </pre>
        <p className="note">Note: Gatsby CLI required globally for the above command</p>
      </Container>
    </Layout>
  );
};

export default IndexPage;
