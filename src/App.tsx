import { useState } from "react";
import { HTMLSelect } from "@blueprintjs/core";
import { USAMap } from "./components/Map";

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
    </>
  );
}

export default App;
