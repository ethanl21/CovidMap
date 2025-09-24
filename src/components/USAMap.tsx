import { MapContainer, TileLayer } from "react-leaflet";
import type { GeoJsonObject } from "geojson";

import useAxios from "axios-hooks";
import { GeoJSONChild } from "./GeoJSONChild";

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
  const [{ data: countyGeoJSON, loading: countyGjLoading }] = useAxios(
    `${import.meta.env.BASE_URL}/geoJSON/county.json`,
  );

  const [{ data: statesGeoJSON, loading: statesGjLoading }] = useAxios(
    `${import.meta.env.BASE_URL}/geoJSON/states.json`,
  );

  console.log(countyGeoJSON);

  const usCenterCoords: [number, number] = [38, -98.35];
  const countyGJ: GeoJsonObject = countyGeoJSON as GeoJsonObject;
  const statesGJ: GeoJsonObject = statesGeoJSON as GeoJsonObject;

  const [{ data: stateTotalData, loading: stateDataLoading }] = useAxios(
    "https://disease.sh/v3/covid-19/nyt/states?lastdays=1",
  );

  const [{ data: countyTotalData, loading: countyDataLoading }] = useAxios(
    "https://disease.sh/v3/covid-19/nyt/counties?lastdays=1",
  );

  if (
    countyGjLoading ||
    statesGjLoading ||
    stateDataLoading ||
    countyDataLoading
  ) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MapContainer
        center={usCenterCoords}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://disease.sh/docs/#/COVID-19%3A%20NYT/get_v3_covid_19_nyt_states">NYT @ disease.sh</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSONChild
          data={countyGJ}
          mode="county"
          itemData={countyTotalData as CountyData[]}
          isVisible={props.mode === "county"}
        />
        <GeoJSONChild
          data={statesGJ}
          mode="states"
          itemData={stateTotalData as StateData[]}
          isVisible={props.mode === "states"}
        />
      </MapContainer>
    </>
  );
};

USAMap.defaultProps = {
  mode: "states",
};
