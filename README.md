# CovidMap

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/ethanl21/CovidMap/build-and-deploy.yml)
![GitHub License](https://img.shields.io/github/license/ethanl21/CovidMap)

CovidMap is a dashboard used to track metrics related to the COVID-10 pandemic.

# Usage

CovidMap is a static SPA using React and Vite. To deploy a copy, clone the repository and enter the following commands:

```sh
npm i
npm build
```

The built files will be located in `dist/`.

# Attribution

CovidMap was created by Allan Cortes, Raquel Cruz, Jose Gonzalez, and Ethan Lew for CPSC 349 at CSUF.

Data is sourced from the NYT (via [disease.sh](https://disease.sh/docs/)) and [Covid Act Now](https://covidactnow.org)

## Open Source

The following open-source production dependencies are used:

```json
{
  "@blueprintjs/core@5.7.2": {
    "licenses": "Apache-2.0",
    "repository": "https://github.com/palantir/blueprint"
  },
  "axios-hooks@5.0.2": {
    "licenses": "MIT",
    "repository": "https://github.com/simoneb/axios-hooks"
  },
  "axios@1.6.2": {
    "licenses": "MIT",
    "repository": "https://github.com/axios/axios"
  },
  "chart.js@4.4.1": {
    "licenses": "MIT",
    "repository": "https://github.com/chartjs/Chart.js"
  },
  "geojson@0.5.0": {
    "licenses": "MIT",
    "repository": "https://github.com/caseycesari/geojson.js"
  },
  "leaflet.markercluster@1.5.3": {
    "licenses": "MIT",
    "repository": "https://github.com/Leaflet/Leaflet.markercluster"
  },
  "leaflet@1.9.4": {
    "licenses": "BSD-2-Clause",
    "repository": "https://github.com/Leaflet/Leaflet"
  },
  "modern-normalize@2.0.0": {
    "licenses": "MIT",
    "repository": "https://github.com/sindresorhus/modern-normalize"
  },
  "react-chartjs-2@5.2.0": {
    "licenses": "MIT",
    "repository": "https://github.com/reactchartjs/react-chartjs-2"
  },
  "react-dom@18.2.0": {
    "licenses": "MIT",
    "repository": "https://github.com/facebook/react"
  },
  "react-leaflet@4.2.1": {
    "licenses": "Hippocratic-2.1",
    "repository": "https://github.com/PaulLeCam/react-leaflet"
  },
  "react@18.2.0": {
    "licenses": "MIT",
    "repository": "https://github.com/facebook/react"
  }
}
```
