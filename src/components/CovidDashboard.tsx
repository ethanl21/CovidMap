import React, { useState } from "react";
import useAxios from "axios-hooks";

interface DashboardProps {}

interface StateData {
  // confirmed, active, recovered, and fatal
  state: string;
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  tests: number;
}

export const Dashboard: React.FC<DashboardProps> = () => {
  //get state info
  const [{ data: stateTotalData, loading: stateDataLoading }] = useAxios(
    "https://disease.sh/v3/covid-19/states",
  );
  //get global info
  const [{ data: globalTotalData, loading: globalDataLoading }] = useAxios(
    "https://disease.sh/v3/covid-19/all",
  );
  //get usa info
  const [{ data: USATotalData, loading: USADataLoading }] = useAxios(
    "  https://disease.sh/v3/covid-19/countries/usa",
  );
  //keep track of user selection
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Check if the data is still loading
  if (stateDataLoading || globalDataLoading || USADataLoading) {
    return <div>Loading...</div>;
  }

  // Check if there is an error fetching data
  if (!stateTotalData || !globalTotalData || !USATotalData) {
    return <div>Error fetching data</div>;
  }
  //when user selects new state update
  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(event.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "200px",
        padding: "10px",
        justifyContent: "space-around",
        border: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: "100px",
        }}
      >
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ backgroundColor: "#333", color: "#fff" }}>
            <tr>
              <th colSpan={3}>Global COVID-19 Data</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Total Cases:</strong>
              </td>
              <td>{globalTotalData.cases.toLocaleString()}</td>
            </tr>
            <tr>
              <td>
                <strong>Total Deaths:</strong>
              </td>
              <td>{globalTotalData.deaths.toLocaleString()}</td>
            </tr>
            <tr>
              <td>
                <strong>Total Recovered:</strong>
              </td>
              <td>{globalTotalData.recovered.toLocaleString()}</td>
            </tr>
            <tr>
              <td>
                <strong>Critical Condition:</strong>
              </td>
              <td>{globalTotalData.critical.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#333", color: "#fff" }}>
          <tr>
            <th colSpan={3}>United States COVID-19 Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Total Cases:</strong>
            </td>
            <td>{USATotalData.cases.toLocaleString()} </td>
          </tr>
          <tr>
            <td>
              <strong>Total Deaths:</strong>
            </td>
            <td>{USATotalData.deaths.toLocaleString()} </td>
          </tr>
          <tr>
            <td>
              <strong>Test Distributed:</strong>
            </td>
            <td>{USATotalData.recovered.toLocaleString()} </td>
          </tr>
          <tr>
            <td>
              <strong>Total Recovered:</strong>
            </td>
            <td>{USATotalData.tests.toLocaleString()} </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label>Select a state: </label>
        <select onChange={handleStateChange} value={selectedState || ""}>
          <option value="" disabled>
            Select a state
          </option>
          {stateTotalData.map((state: StateData) => (
            <option key={state.state} value={state.state}>
              {state.state}
            </option>
          ))}
        </select>

        {selectedState && (
          <div>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead style={{ backgroundColor: "#333", color: "#fff" }}>
                <tr>
                  <th colSpan={3}>{selectedState} Data</th>
                </tr>
              </thead>
              <tbody>
                {stateTotalData
                  .filter(
                    (state: { state: string }) => state.state === selectedState,
                  )
                  .map((state: StateData) => (
                    <>
                      <tr>
                        <td>
                          <strong>Confirmed Cases:</strong>
                        </td>
                        <td>{state.cases.toLocaleString()}</td>
                      </tr>

                      <tr>
                        <td>
                          <strong>Active Cases :</strong>
                        </td>
                        <td>{state.active.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total Recovered:</strong>
                        </td>
                        <td> {state.recovered.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total Deaths:</strong>
                        </td>
                        <td> {state.deaths.toLocaleString()}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
};
// confirmed, active, recovered, and fatal
