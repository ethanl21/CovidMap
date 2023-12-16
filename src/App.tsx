import { useState } from "react";
import { HTMLSelect } from "@blueprintjs/core";
import { USAMap } from "./components/Map";
import { Dashboard } from "./components/CovidDashboard";

function App() {
  const [mapState, setMapState] = useState("states");

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
    </>
  );
}

export default App;
