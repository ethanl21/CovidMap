import { useState } from "react";
import { USAMap } from "./components/USAMap";
import { CovidDashboard } from "./components/CovidDashboard";
import { Graphs } from "./components/Graphs";

import statesAbbr from "./assets/state-abbr.json";

function App() {
  const [mapState, setMapState] = useState("states");
  const [selectedState, setSelectedState] = useState("CA");

  return (
    <>
      <header>
        <div style={{ backgroundColor: "lightgray" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "3rem", marginBottom: "0" }}>
              🦠 CovidMap 💉
            </h1>
            <h2>
              <em>
                ✨ by Allan Cortes, Raquel Cruz, Jose Gonzalez, and Ethan Lew ✨
              </em>
            </h2>
          </div>
        </div>
      </header>

      <main>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "white",
            margin: "2rem",
            borderRadius: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <h1>Map</h1>
            <fieldset>
              <legend>Mode</legend>
              <select
                defaultValue={mapState}
                onChange={(e) => setMapState(e.target.value)}
              >
                <option value={"county"}>Counties</option>
                <option value={"states"}>States</option>
              </select>
            </fieldset>
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
            backgroundColor: "white",
            margin: "2rem",
            borderRadius: "1rem",
          }}
        >
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
            <fieldset>
              <legend>State</legend>
              <select
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
              </select>
            </fieldset>
          </div>
          <div style={{ padding: "1rem" }}>
            <CovidDashboard stateCode={selectedState} />
          </div>
        </div>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "white",
            margin: "2rem",
            borderRadius: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <h1>
              Charts <a href="https://covidactnow.org">[source]</a>
            </h1>
            <fieldset>
              <legend>State</legend>
              <select
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
              </select>
            </fieldset>
          </div>
          <Graphs stateCode={selectedState} />
        </div>
      </main>

      <footer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "1rem",
            width: "100%",
            backgroundColor: "lightgray",
          }}
        >
          <a
            href="https://github.com/ethanl21/CovidMap"
            rel="noopener"
            target="_blank"
          >
            Source Code
          </a>
          •
          <a href="https://disease.sh" rel="noopener" target="_blank">
            Map Data Source
          </a>
          •
          <a href="https://covidactnow.org" rel="noopener" target="_blank">
            Tables and Charts Data Source
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
