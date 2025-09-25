import useAxios from "axios-hooks";
import stateAbbr from "../assets/state-abbr.json";
import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loading } from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DashboardProps {
  stateCode: string;
}

const stateCodeToStateName = Object.fromEntries(
  Object.entries(stateAbbr).map(([key, value]) => [value, key]),
);

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

  const stateData = useMemo(() => {
    if (stateDataLoading) return {};
    return stateTotalData.filter(
      (state: { state: string }) =>
        state.state === stateCodeToStateName[props.stateCode],
    )[0];
  }, [props.stateCode, stateDataLoading, stateTotalData]);

  // Check if the data is still loading
  if (stateDataLoading || globalDataLoading || USADataLoading) {
    return <Loading />;
  }

  // Check if there is an error fetching data
  if (!stateTotalData || !globalTotalData || !USATotalData) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <div className="flex flex-row justify-center gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Global Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableHead scope="row" className="font-medium">
                    Cases
                  </TableHead>
                  <TableCell>
                    {(globalTotalData.cases as number).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Deaths</TableHead>
                  <TableCell>
                    {(globalTotalData.deaths as number).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Recovered</TableHead>
                  <TableCell>
                    {(globalTotalData.recovered as number).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Critical Condition</TableHead>
                  <TableCell>
                    {(globalTotalData.critical as number).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>USA</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableHead scope="row" className="font-medium">
                    Cases
                  </TableHead>
                  <TableCell>
                    {(stateData.cases as number).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Deaths</TableHead>
                  <TableCell>
                    {(USATotalData.deaths as number).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Recovered</TableHead>
                  <TableCell>
                    {(USATotalData.recovered as number).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Tests Distributed</TableHead>
                  <TableCell>
                    {(USATotalData.tests as number).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{stateCodeToStateName[props.stateCode]}</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableHead scope="row" className="font-medium">
                    Cases
                  </TableHead>
                  <TableCell>
                    {(stateData.cases as number).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Deaths</TableHead>
                  <TableCell>
                    {(stateData.deaths as number).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Recovered</TableHead>
                  <TableCell>
                    {stateData.recovered === 0
                      ? "Not Reporting"
                      : (stateData.recovered as number).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
