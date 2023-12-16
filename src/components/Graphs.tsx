import useAxios from "axios-hooks";

// ChartJS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const vaccinationRateBarOptions = {
  legend: {
    display: false,
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Vaccination Rate",
    },
  },

  scales: {
    y: {
      suggestedMax: 1,
      startAtZero: true,
      title: {
        display: true,
        text: "Vaccination rate (%)",
      },
      ticks: {
        callback: (value: string | number) => {
          if (typeof value === "string") {
            return `${parseInt(value) * 100}%`;
          } else {
            return `${value * 100}%`;
          }
        },
      },
    },
  },
};

const bedsPieOptions = {
  plugins: {
    title: {
      display: true,
      text: "Hospital Beds Occupied by COVID patients (%)",
    },
  },
};

const riskLevelBarOptions = {
  legend: {
    display: false,
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Risk Levels",
    },
  },

  scales: {
    y: {
      suggestedMax: 5,
      startAtZero: true,
      title: {
        display: true,
        text: "Risk Level Rating",
      },
      ticks: {
        stepSize: 1,
      },
    },
  },
};

const vaccinationLabels = [
  "Initiated",
  "Completed",
  "Additional Dose",
  "Fall 2022 Bivalent Booster",
];

const bedLabels = ["COVID-19 Patients", "Other"];

const riskLabels = [
  "Overall",
  "Test Positivity",
  "Case Density",
  "Contact Tracer Capacity",
  "Infection Rate",
  "ICU Capacity",
];

export const CAN_API_KEY = "47e3b5f2e75a45b599ea0f54afef6396";
const BASE_URL = "https://api.covidactnow.org/v2";

export interface GraphsProps {
  stateCode: string;
}
export const Graphs = (props: GraphsProps) => {
  const [{ data: stateTotalData, loading: stateDataLoading }] = useAxios(
    `${BASE_URL}/state/${props.stateCode}.json?apiKey=${CAN_API_KEY}`,
  );

  const [{ data: nationalTotalData, loading: nationalDataLoading }] = useAxios(
    `${BASE_URL}/country/US.json?apiKey=${CAN_API_KEY}`,
  );

  let stateVaccinationDataset;
  let covidBedsDataset;
  let riskLevelsDataset;
  if (!stateDataLoading) {
    // state vaccination rates
    stateVaccinationDataset = {
      labels: vaccinationLabels,
      datasets: [
        {
          label: "Data",
          data: [
            stateTotalData.metrics.vaccinationsInitiatedRatio,
            stateTotalData.metrics.vaccinationsCompletedRatio,
            stateTotalData.metrics.vaccinationsAdditionalDoseRatio,
            stateTotalData.metrics.vaccinationsFall2022BivalentBoosterRatio,
          ],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    // state covid patient bed ratio
    covidBedsDataset = {
      labels: bedLabels,
      datasets: [
        {
          label: "COVID-19 Patients",
          data: [
            stateTotalData.metrics.bedsWithCovidPatientsRatio,
            1 - stateTotalData.metrics.bedsWithCovidPatientsRatio,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
      ],
    };

    // cdc risk levels data
    riskLevelsDataset = {
      labels: riskLabels,
      datasets: [
        {
          label: `Risk Level Ratings (${props.stateCode})`,
          data: [
            stateTotalData.riskLevels.overall,
            stateTotalData.riskLevels.testPositivityRatio,
            stateTotalData.riskLevels.caseDensity,
            stateTotalData.riskLevels.contactTracerCapacityRatio,
            stateTotalData.riskLevels.infectionRate,
            stateTotalData.riskLevels.icuCapacityRatio,
          ],
          backgroundColor: "rgba(220, 67, 255, 0.5)",
        },
      ],
    };

    console.log(stateTotalData.cdcTransmissionLevel);
  } else {
    stateVaccinationDataset = { labels: vaccinationLabels, datasets: [] };
    covidBedsDataset = { labels: bedLabels, datasets: [] };
    riskLevelsDataset = { labels: riskLabels, datasets: [] };
  }

  let nationalAvgDataset;
  if (!nationalDataLoading) {
    nationalAvgDataset = {
      labels: riskLabels,
      datasets: [
        {
          label: "Risk Level Ratings (USA)",
          data: [
            nationalTotalData.riskLevels.overall,
            nationalTotalData.riskLevels.testPositivityRatio,
            nationalTotalData.riskLevels.caseDensity,
            nationalTotalData.riskLevels.contactTracerCapacityRatio,
            nationalTotalData.riskLevels.infectionRate,
            nationalTotalData.riskLevels.icuCapacityRatio,
          ],
          backgroundColor: "rgba(67, 255, 174, 0.5)",
        },
      ],
    };
  } else {
    nationalAvgDataset = { labels: riskLabels, datasets: [] };
  }

  return (
    <>
      <div className="chart-container">
        <div>
          <h2>Vaccines and Hospital Beds</h2>
          <div className="chart-row">
            <Bar
              options={vaccinationRateBarOptions}
              data={stateVaccinationDataset}
            />

            <Pie data={covidBedsDataset} options={bedsPieOptions} />
          </div>
        </div>

        <div>
          <h2>Risk Levels</h2>
          <div className="chart-row">
            <Bar options={riskLevelBarOptions} data={riskLevelsDataset} />

            <Bar options={riskLevelBarOptions} data={nationalAvgDataset} />
          </div>
        </div>
      </div>
    </>
  );
};
