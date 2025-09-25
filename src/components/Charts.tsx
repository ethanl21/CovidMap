import useAxios from "axios-hooks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Label,
  Cell,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loading } from "@/components/Loading";

const CAN_API_KEY = "47e3b5f2e75a45b599ea0f54afef6396";
const BASE_URL = "https://api.covidactnow.org/v2";

export interface ChartsProps {
  stateCode: string;
}
export const Charts = (props: ChartsProps) => {
  const [{ data: stateTotalData, loading: stateDataLoading }] = useAxios(
    `${BASE_URL}/state/${props.stateCode}.json?apiKey=${CAN_API_KEY}`,
  );

  const [{ data: nationalTotalData, loading: nationalDataLoading }] = useAxios(
    `${BASE_URL}/country/US.json?apiKey=${CAN_API_KEY}`,
  );

  if (stateDataLoading || nationalDataLoading) {
    return <Loading />;
  }

  // Vaccines
  const vaccineBarChartData = [
    {
      name: "Initated",
      ratio: stateTotalData.metrics.vaccinationsInitiatedRatio,
    },
    {
      name: "Completed",
      ratio: stateTotalData.metrics.vaccinationsCompletedRatio,
    },
    {
      name: "Additional Dose",
      ratio: stateTotalData.metrics.vaccinationsAdditionalDoseRatio,
    },
    {
      name: "Fall 2022 Bivalent Booster",
      ratio: stateTotalData.metrics.vaccinationsFall2022BivalentBoosterRatio,
    },
  ];

  const vaccineBarChartConfig = {
    ratio: {
      label: "Status",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  // Hospital beds
  const hospitalBedData = [
    {
      name: "COVID-19 Patients",
      ratio: stateTotalData.metrics.bedsWithCovidPatientsRatio,
    },
    {
      name: "Other Patients",
      ratio: 1 - stateTotalData.metrics.bedsWithCovidPatientsRatio,
    },
  ];

  const hospitalBedPieChartConfig = {
    ratio: {
      label: "Status",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const stateRiskLevelData = [
    {
      name: "Overall",
      level: stateTotalData.riskLevels.overall,
    },
    {
      name: "Test Positivity Ratio",
      level: stateTotalData.riskLevels.testPositivityRatio,
    },
    {
      name: "Case Density",
      level: stateTotalData.riskLevels.testPositivityRatio,
    },
    {
      name: "Contact Tracer Capacity",
      level: stateTotalData.riskLevels.contactTracerCapacityRatio,
    },
    {
      name: "Infection Rate",
      level: stateTotalData.riskLevels.infectionRate,
    },
    {
      name: "ICU Capacity Ratio",
      level: stateTotalData.riskLevels.icuCapacityRatio,
    },
  ];

  const nationalRiskLevelData = [
    {
      name: "Overall",
      level: nationalTotalData.riskLevels.overall,
    },
    {
      name: "Test Positivity Ratio",
      level: nationalTotalData.riskLevels.testPositivityRatio,
    },
    {
      name: "Case Density",
      level: nationalTotalData.riskLevels.testPositivityRatio,
    },
    {
      name: "Contract Tracer Capacity",
      level: nationalTotalData.riskLevels.contactTracerCapacityRatio,
    },
    {
      name: "Infection Rate",
      level: nationalTotalData.riskLevels.infectionRate,
    },
    {
      name: "ICU Capacity Ratio",
      level: nationalTotalData.riskLevels.icuCapacityRatio,
    },
  ];

  const riskLevelBarChartConfig = {
    level: {
      label: "Category",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <div>
        <h3 className="mb-8 text-2xl font-bold">Vaccines and Hospital Beds</h3>
        <div className="flex w-full flex-row gap-4">
          <div className="flex flex-col gap-8">
            <h4 className="mx-auto w-fit text-xl">Vaccination Rate</h4>
            <ChartContainer
              config={vaccineBarChartConfig}
              className="min-h-[350px] w-full"
            >
              <BarChart accessibilityLayer data={vaccineBarChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={"name"} label=""></XAxis>
                <YAxis dataKey="ratio" tickFormatter={(val) => `${val * 100}%`}>
                  <Label
                    offset={-1}
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle" }}
                  >
                    Ratio
                  </Label>
                </YAxis>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(val) => `${(val as number) * 100}%`}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="ratio"
                  fill="var(--color-pink-300)"
                  radius={4}
                ></Bar>
              </BarChart>
            </ChartContainer>
          </div>

          <div className="flex flex-col gap-8">
            <h4 className="mx-auto w-fit text-xl">Hospital Bed Usage</h4>
            <ChartContainer
              config={hospitalBedPieChartConfig}
              className="min-h-[350px] w-full"
            >
              <PieChart>
                <Pie dataKey="ratio" data={hospitalBedData}>
                  {hospitalBedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "var(--color-blue-300)"
                          : "var(--color-green-300)"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => `${val * 100}%`} />
                <Legend verticalAlign="bottom" align="center" />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <h3 className="mb-8 text-2xl font-bold">Risk Levels</h3>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-8">
            <h4 className="mx-auto w-fit text-xl">
              Risk Level ({props.stateCode})
            </h4>
            <ChartContainer
              config={riskLevelBarChartConfig}
              className="min-h-[350px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={stateRiskLevelData}
                margin={{ top: 0, right: 0, bottom: 20, left: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={"name"}
                  angle={-15}
                  tickMargin={15}
                  tick={{ textAnchor: "middle" }}
                ></XAxis>
                <YAxis dataKey="level">
                  <Label
                    offset={10}
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle" }}
                  >
                    Risk Level
                  </Label>
                </YAxis>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="level"
                  fill="var(--color-violet-300)"
                  opacity={0.75}
                  radius={4}
                ></Bar>
              </BarChart>
            </ChartContainer>
          </div>

          <div className="flex flex-col gap-8">
            <h4 className="mx-auto w-fit text-xl">Risk Level (National)</h4>
            <ChartContainer
              config={riskLevelBarChartConfig}
              className="min-h-[350px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={nationalRiskLevelData}
                margin={{ top: 0, right: 0, bottom: 20, left: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={"name"}
                  angle={-15}
                  tickMargin={15}
                  tick={{ textAnchor: "middle" }}
                ></XAxis>
                <YAxis dataKey="level">
                  <Label
                    offset={10}
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle" }}
                  >
                    Risk Level
                  </Label>
                </YAxis>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="level"
                  fill="var(--color-green-300)"
                  opacity={0.75}
                  radius={4}
                ></Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
