import useAxios from "axios-hooks";

// leaflet modules
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet.markercluster";
import type { GeoJsonObject } from "geojson";

// components
import { GeoJSONChild } from "./GeoJSONChild";

// json files
import countyGeoJSON from "../assets/geoJSON/county.json";
import statesGeoJSON from "../assets/geoJSON/states.json";

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
  const [{ data: countyTotalData, loading: countyDataLoading}] = useAxios("https://disease.sh/v3/covid-19/nyt/counties?lastdays=1");

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
