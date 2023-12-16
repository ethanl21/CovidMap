import { useEffect } from "react";
import useAxios from "axios-hooks";

// leaflet modules
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import type { GeoJsonObject } from "geojson";

// json files
import countyGeoJSON from "../assets/geoJSON/county.json";
import statesGeoJSON from "../assets/geoJSON/states.json";
import stateNames from "../assets/states.json";

// other
import { formatNumber } from "../lib/numberFormat";

interface GeoJSONChildProps {
  data: GeoJsonObject;
  isVisible: boolean;
  itemData: StateData[] | CountyData[];
  mode: "county" | "states";
}
const GeoJSONChild = (props: GeoJSONChildProps) => {
  const map = useMap();

  useEffect(() => {
    if (map && props.isVisible) {
      const markerGroup = L.layerGroup();

      const markerClusters = new Map();
      // only cluster counties
      if (props.mode === "county") {
        Object.keys(stateNames).forEach((stateName) => {
          markerClusters.set(stateName, L.markerClusterGroup());
        });
      }

      const geoJsonLayer = L.geoJSON(props.data, {
        onEachFeature: (feature, layer) => {
          if (
            feature.geometry.type === "Polygon" ||
            feature.geometry.type === "MultiPolygon"
          ) {
            let dataItem;
            let popupContent;
            if (props.mode === "county") {
              const dataItems = props.itemData as CountyData[];
              dataItem = dataItems.find((val) => {
                const formattedFips =
                  val.fips.substring(0, 2) + "-" + val.fips.substring(2);

                return feature.properties["FIPS_CODE"] === formattedFips;
              });

              if (
                dataItem == null ||
                dataItem.county == null ||
                dataItem.state == null
              ) {
                popupContent = `<h1>No Data</h1>`;
              } else {
                popupContent = `
                <h1>${dataItem?.county} County, ${dataItem?.state}</h1>
                <p><strong>Cases:</strong> ${
                  (dataItem && formatNumber(dataItem.cases)) || "No Data"
                }<br />
                <strong>Deaths:</strong> ${
                  (dataItem && formatNumber(dataItem.deaths)) || "No Data"
                }<br />
                <strong>Updated:</strong> ${
                  (dataItem && new Date(dataItem.updated).toLocaleString()) ||
                  "No Data"
                }</p>
              `;
              }
            } else {
              const dataItems = props.itemData as StateData[];
              dataItem = dataItems.find((val) => {
                return feature.properties["STATEFP"] === val.fips;
              });
              if (dataItem == null || dataItem.state == null) {
                popupContent = `<h1>No Data</h1>`;
              } else {
                popupContent = `
              <h1>${dataItem?.state}</h1>
              <p><strong>Cases:</strong> ${
                (dataItem && formatNumber(dataItem.cases)) || "No Data"
              }<br />
                <strong>Deaths:</strong> ${
                  (dataItem && formatNumber(dataItem.deaths)) || "No Data"
                }<br />
                <strong>Updated:</strong> ${
                  (dataItem && new Date(dataItem.updated).toLocaleString()) ||
                  "No Data"
                }</p>
              `;
              }
            }

            layer.bindPopup(popupContent);

            // @ts-expect-error getBounds does exist on layer
            const markerPos = layer.getBounds().getCenter();
            const marker = L.marker(markerPos);
            marker.bindTooltip(popupContent);

            if (props.mode === "states") {
              marker.addTo(markerGroup);
            } else {
              if (dataItem) {
                const cluster = markerClusters.get(dataItem.state);
                if (cluster) {
                  marker.addTo(cluster);
                }
              }
            }
          }
        },
      }).addTo(map);

      if (props.mode === "county") {
        markerClusters.forEach((cluster) => {
          cluster.addTo(markerGroup);
        });
      }
      markerGroup.addTo(map);

      return () => {
        // Cleanup layer when component unmounts
        if (map) {
          map.removeLayer(markerGroup);
          map.removeLayer(geoJsonLayer);
        }
      };
    }
  }, [props.isVisible, props.data, map, props.mode, props.itemData]);

  return null; // GeoJSONChild is a container component and does not render anything
};

interface StateData {
  cases: number;
  date: string;
  deaths: number;
  fips: string;
  state: string;
  updated: number;
}

interface CountyData {
  cases: number;
  county: string;
  date: string;
  deaths: number;
  fips: string;
  state: string;
  updated: number;
}

export interface USAMapProps {
  mode: string;
}
export const USAMap = (props: USAMapProps) => {
  const usCenterCoords: [number, number] = [38, -98.35];
  const countyGJ: GeoJsonObject = countyGeoJSON as GeoJsonObject;
  const statesGJ: GeoJsonObject = statesGeoJSON as GeoJsonObject;

  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ { data: stateTotalData, loading: stateDataLoading}] = useAxios("https://disease.sh/v3/covid-19/nyt/states?lastdays=1");

  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ data: countyTotalData, loading: countyDataLoading}] = useAxios("https://disease.sh/v3/covid-19/nyt/states?lastdays=1");

  return (
    <>
      <MapContainer
        center={usCenterCoords}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {!countyDataLoading && (
          <GeoJSONChild
            data={countyGJ}
            mode="county"
            itemData={countyTotalData}
            isVisible={props.mode === "county"}
          />
        )}
        {!stateDataLoading && (
          <GeoJSONChild
            data={statesGJ}
            mode="states"
            itemData={stateTotalData}
            isVisible={props.mode === "states"}
          />
        )}
      </MapContainer>
    </>
  );
};

USAMap.defaultProps = {
  mode: "states",
};
