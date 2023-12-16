import L from "leaflet";
import type { GeoJsonObject } from "geojson";
import { StateData, CountyData } from "../lib/API";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import stateNames from "../assets/states.json";
import { formatNumber } from "../lib/numberFormat";

export interface GeoJSONChildProps {
  data: GeoJsonObject;
  isVisible: boolean;
  itemData: StateData[] | CountyData[];
  mode: "county" | "states";
}
export const GeoJSONChild = (props: GeoJSONChildProps) => {
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
        if (map) {
          map.removeLayer(markerGroup);
          map.removeLayer(geoJsonLayer);
        }
      };
    }
  }, [props.isVisible, props.data, map, props.mode, props.itemData]);

  return null;
};
