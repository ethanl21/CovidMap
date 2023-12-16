import { useState } from "react";
import { HTMLSelect, FormGroup, Card } from "@blueprintjs/core";
import { USAMap } from "./components/Map";
import { Dashboard } from "./components/CovidDashboard";
import { Graphs } from "./components/Graphs";

import statesAbbr from "./assets/state-abbr.json";

function App() {
  const [mapState, setMapState] = useState("states");
  const [selectedState, setSelectedState] = useState("CA");

  return (
    <>
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
      
      <HTMLSelect
        defaultValue={mapState}
        onChange={(e) => setMapState(e.target.value)}
      >
        <option value={"county"}>Counties</option>
        <option value={"states"}>States</option>
      </HTMLSelect>
      <Dashboard/>
      <div style={{ padding: "1rem" }}>
        <h1>Map</h1>
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

      <div style={{ padding: "1rem", width: "20rem" }}>
        <Card interactive>
          <h2>Options</h2>
          <FormGroup label="Mode">
            <HTMLSelect
              defaultValue={mapState}
              onChange={(e) => setMapState(e.target.value)}
            >
              <option value={"county"}>Counties</option>
              <option value={"states"}>States</option>
            </HTMLSelect>
          </FormGroup>
        </Card>
      </div>

      <div style={{ padding: "1rem" }}>
        <h1>Charts</h1>
        <div style={{ padding: "1rem", width: "20rem" }}>
          <Card interactive>
            <h2>Options</h2>
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
          </Card>
        </div>
        <Graphs stateCode={selectedState} />
      </div>
    </>
  );
}

export default App;
