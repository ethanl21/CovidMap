import { useState } from "react";
import { USAMap } from "@/components/USAMap";
import { CovidDashboard } from "./components/CovidDashboard";
import { Charts } from "@/components/Charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

// state abbreviations
import statesAbbr from "./assets/state-abbr.json";
const stateCodeToStateName = Object.fromEntries(
  Object.entries(statesAbbr).map(([key, value]) => [value, key]),
);

// footer nav
const footerNav: { title: string; href: string }[] = [
  {
    title: "Source Code",
    href: "https://github.com/ethanl21/CovidMap",
  },
  {
    title: "Map Data Source",
    href: "https://disease.sh/",
  },
  {
    title: "Tables and Charts Data Source",
    href: "https://covidactnow.org/",
  },
];

function App() {
  const [mapState, setMapState] = useState("states");
  const [selectedState, setSelectedState] = useState("CA");

  return (
    <>
      <header>
        <div className="bg-gray-200">
          <hgroup className="flex w-full flex-col items-center justify-center gap-4 p-4">
            <h1 className="text-5xl font-bold">🦠 CovidMap 💉</h1>
          </hgroup>
        </div>
      </header>

      <main className="flex flex-col gap-4 bg-blue-200 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              <h2>Map</h2>
            </CardTitle>
            <CardDescription>
              {mapState.charAt(0).toUpperCase() + mapState.slice(1)}
            </CardDescription>
            <CardAction>
              <fieldset className="border p-2">
                <legend>Mode</legend>
                <Select
                  defaultValue={mapState}
                  onValueChange={(val) => setMapState(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Area"></SelectValue>
                  </SelectTrigger>

                  <SelectContent className="z-[9999]">
                    <SelectItem value="county">Counties</SelectItem>
                    <SelectItem value="states">States</SelectItem>
                  </SelectContent>
                </Select>
              </fieldset>
            </CardAction>
          </CardHeader>

          <CardContent className="h-[80svh]">
            <USAMap mode={mapState} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              <h2>Tables</h2>
            </CardTitle>
            <CardDescription>
              {stateCodeToStateName[selectedState]}
            </CardDescription>
            <CardAction>
              <fieldset className="border p-2">
                <legend>State</legend>
                <Select
                  value={selectedState}
                  onValueChange={(val) => setSelectedState(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(statesAbbr).map((state, index) => {
                      return (
                        <SelectItem value={state[1]} key={index}>
                          {state[0]}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </fieldset>
            </CardAction>
          </CardHeader>

          <CardContent>
            <CovidDashboard stateCode={selectedState} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              <h2>Charts</h2>
            </CardTitle>
            <CardDescription>
              {stateCodeToStateName[selectedState]}
            </CardDescription>
            <CardAction>
              <fieldset className="border p-2">
                <legend>State</legend>
                <Select
                  value={selectedState}
                  onValueChange={(val) => setSelectedState(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(statesAbbr).map((state, index) => {
                      return (
                        <SelectItem value={state[1]} key={index}>
                          {state[0]}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </fieldset>
            </CardAction>
          </CardHeader>

          <CardContent>
            <Charts stateCode={selectedState} />
          </CardContent>
        </Card>
      </main>

      <footer className="flex list-none flex-row justify-center">
        <NavigationMenu>
          {footerNav.map((item) => {
            return (
              <NavigationMenuItem key={crypto.randomUUID()}>
                <NavigationMenuLink
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenu>
      </footer>
    </>
  );
}

export default App;
