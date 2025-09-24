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
        <div className="bg-gray-200">
          <hgroup className="flex w-full flex-col items-center justify-center gap-4 p-4">
            <h1 className="text-5xl font-bold">🦠 CovidMap 💉</h1>
            <h2 className="text-2xl font-bold italic">
              ✨ by Allan Cortes, Raquel Cruz, Jose Gonzalez, and Ethan Lew ✨
            </h2>
          </hgroup>
        </div>
      </header>

      <main className="bg-blue-200 p-4">
        <div className="m-8 rounded-2xl bg-white p-4">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold">Map</h1>
            <fieldset className="border p-2">
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
          <div className="m-8 h-[80svh] overflow-hidden rounded-2xl rounded-br-none">
            <USAMap mode={mapState} />
          </div>
        </div>

        <div className="m-8 rounded-2xl bg-white">
          <div className="flex items-start justify-between p-4">
            <h2 className="flex flex-row items-center gap-2 text-3xl font-bold">
              Tables
              <a
                className="text-blue-700 visited:text-violet-800"
                href="https://covidactnow.org"
              >
                [<span className="underline">source</span>]
              </a>
            </h2>
            <fieldset className="border p-2">
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
          <div className="p-4">
            <CovidDashboard stateCode={selectedState} />
          </div>
        </div>

        <div className="m-8 rounded-2xl bg-white p-4">
          <div className="flex items-start justify-between">
            <h2 className="flex flex-row items-center gap-2 text-3xl font-bold">
              Charts
              <a
                className="text-blue-700 visited:text-violet-800"
                href="https://covidactnow.org"
              >
                [<span className="underline">source</span>]
              </a>
            </h2>
            <fieldset className="border p-2">
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
        <nav>
          <ul className="flex w-full justify-center gap-8 p-4">
            <li>
              <a
                href="https://github.com/ethanl21/CovidMap"
                rel="noopener"
                target="_blank"
              >
                Source Code
              </a>
            </li>
            <li>
              <a href="https://disease.sh" rel="noopener" target="_blank">
                Map Data Source
              </a>
            </li>
            <li>
              <a href="https://covidactnow.org" rel="noopener" target="_blank">
                Tables and Charts Data Source
              </a>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
}

export default App;
