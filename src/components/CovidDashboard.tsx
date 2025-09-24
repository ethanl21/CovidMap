import useAxios from "axios-hooks";
import stateAbbr from "../assets/state-abbr.json";
import React from "react";

interface DashboardProps {
  stateCode: string;
}

const stateCodeToStateName = Object.fromEntries(
  Object.entries(stateAbbr).map(([key, value]) => [value, key]),
);

interface StateData {
  state: string;
  cases: number;
  deaths: number;
  recovered: number;
  tests: number;
}

export const CovidDashboard: React.FC<DashboardProps> = (
  props: DashboardProps,
) => {
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

  // Check if the data is still loading
  if (stateDataLoading || globalDataLoading || USADataLoading) {
    return <div>Loading...</div>;
  }

  // Check if there is an error fetching data
  if (!stateTotalData || !globalTotalData || !USATotalData) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="flex flex-row justify-around gap-52 p-2.5">
      <div className="flex flex-col pl-24">
        <table className="w-full border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th colSpan={3}>Global COVID-19 Data</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border">
                <strong>Total Cases:</strong>
              </td>
              <td className="border">
                {(globalTotalData.cases as number).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="border">
                <strong>Total Deaths:</strong>
              </td>
              <td className="border">
                {(globalTotalData.deaths as number).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="border">
                <strong>Total Recovered:</strong>
              </td>
              <td className="border">
                {(globalTotalData.recovered as number).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="border">
                <strong>Critical Condition:</strong>
              </td>
              <td className="border">
                {(globalTotalData.critical as number).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <table className="w-full border-collapse">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th colSpan={3}>United States COVID-19 Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border">
              <strong>Total Cases:</strong>
            </td>
            <td className="border">
              {(USATotalData.cases as number).toLocaleString()}{" "}
            </td>
          </tr>
          <tr>
            <td className="border">
              <strong>Total Deaths:</strong>
            </td>
            <td className="border">
              {(USATotalData.deaths as number).toLocaleString()}{" "}
            </td>
          </tr>
          <tr>
            <td className="border">
              <strong>Test Distributed:</strong>
            </td>
            <td className="border">
              {(USATotalData.recovered as number).toLocaleString()}{" "}
            </td>
          </tr>
          <tr>
            <td className="border">
              <strong>Total Recovered:</strong>
            </td>
            <td className="border">
              {(USATotalData.tests as number).toLocaleString()}{" "}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex flex-col">
        <div>
          <table className="w-full border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th colSpan={3}>
                  {stateCodeToStateName[props.stateCode]} Data
                </th>
              </tr>
            </thead>
            <tbody>
              {stateTotalData
                .filter(
                  (state: { state: string }) =>
                    state.state === stateCodeToStateName[props.stateCode],
                )
                .map((state: StateData) => (
                  <React.Fragment key={crypto.randomUUID()}>
                    <tr>
                      <td className="border">
                        <strong>Confirmed Cases:</strong>
                      </td>
                      <td className="border">
                        {(state.cases as number).toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td className="border">
                        <strong>Total Recovered:</strong>
                      </td>
                      <td className="border">
                        {state.recovered == 0
                          ? "Not Reporting"
                          : (state.recovered as number).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="border">
                        <strong>Total Deaths:</strong>
                      </td>
                      <td className="border">
                        {" "}
                        {(state.deaths as number).toLocaleString()}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div></div>
    </div>
  );
};
