import { useState } from "react";
import { HTMLSelect, FormGroup } from "@blueprintjs/core";
import { USAMap } from "./components/Map";
import { Dashboard } from "./components/CovidDashboard";
import { Graphs } from "./components/Graphs";

import statesAbbr from "./assets/state-abbr.json";

function App() {
  const [mapState, setMapState] = useState("states");
  const [selectedState, setSelectedState] = useState("CA");

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <h1>Map</h1>
          <FormGroup label="Mode">
            <HTMLSelect
              defaultValue={mapState}
              onChange={(e) => setMapState(e.target.value)}
            >
              <option value={"county"}>Counties</option>
              <option value={"states"}>States</option>
            </HTMLSelect>
          </FormGroup>
        </div>
        <div
          style={{
            height: "80svh",
            margin: "2rem",
            borderRadius: "1rem",
            borderBottomRightRadius: "unset",
            overflow: "hidden",
          }}
        >
          <USAMap mode={mapState} />
        </div>
      </div>

      <div
        style={{
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <h1>
          Tables <a href="https://covidactnow.org">[source]</a>
        </h1>
        <FormGroup label="State">
          <HTMLSelect
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {Object.entries(statesAbbr).map((state, index) => {
              return (
                <option value={state[1]} key={index}>
                  {state[0]}
                </option>
              );
            })}
          </HTMLSelect>
        </FormGroup>
      </div>
      <div style={{ padding: "1rem" }}>
        <Dashboard stateCode={selectedState} />
      </div>

      <div style={{ padding: "1rem" }}>
        <div
          style={{
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <h1>
            Charts <a href="https://covidactnow.org">[source]</a>
          </h1>
          <FormGroup label="State">
            <HTMLSelect
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {Object.entries(statesAbbr).map((state, index) => {
                return (
                  <option value={state[1]} key={index}>
                    {state[0]}
                  </option>
                );
              })}
            </HTMLSelect>
          </FormGroup>
        </div>
        <Graphs stateCode={selectedState} />
      </div>
    </>
  );
}

export default App;
