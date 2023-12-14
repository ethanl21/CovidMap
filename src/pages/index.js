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
  lat: 0,
  lng: 0,
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

    function countryPointToLayer( feature = {}, latlng ) {
      const { properties = {} } = feature;
      let updateFormatted;
      let caseString;

      // destructure data
      const { country, updated, cases, deaths, recovered } = properties;

      caseString = `${cases}`;

      if ( cases > 1000 ) {
        caseString = `${caseString.slice( 0, -3 )}k+`;
      }

      if ( updated ) {
        updateFormatted = new Date( updated ).toLocaleString();
      }

      const html = `
<span class="icon-marker">
    <span class="icon-marker-tooltip">
        <h2>${country}</h2>
        <ul>
            <li><strong>Confirmed: </strong>${cases}</li>
            <li><strong>Deaths: </strong>${deaths}</li>
            <li><strong>Recovered: </strong>${recovered}</li>
            <li><strong>Last Update: </strong>${updateFormatted}</li>
        </ul>
    </span>
    ${caseString}
</span>
`;
      return L.marker( latlng, {
        icon: L.divIcon({
          className: 'icon',
          html,
        }),
        riseOnHover: true,
      });
    }

    // Insert GeoJSON into map
    const geoJSONLayers = new L.GeoJSON( geoJSON, {
      pointToLayer: countryPointToLayer,
    });
    geoJSONLayers.addTo( map );
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'MapBox',
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
