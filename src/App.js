import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//fetch components like charts and tables from gooddata SDK as well as its styling sheet
import { Kpi, Visualization, AfmComponents } from '@gooddata/react-components';
import '@gooddata/react-components/styles/css/main.css';

//loading data from your project on gooddata with all attributes and store them in a json file by using
// > gdc-catalog-export --project-id la84vcyhrq8jwbu4wpipw66q2sqeb923 --username <your-gooddata-username> --password <your-password> --output src/catalog.json
import { CatalogHelper } from '@gooddata/react-components';
import catalogJson from './catalog.json';
const C = new CatalogHelper(catalogJson);

const { BarChart } = AfmComponents;

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React, servant!</h1>
        </header>
          <h3>This is a GoodData component for a single KPI: </h3>
          <Kpi
              projectId="la84vcyhrq8jwbu4wpipw66q2sqeb923"
              measure={C.metric('Avg Deal Size')} />
          <h3>This is a GoodData component for table: </h3>
          <Visualization
              projectId="la84vcyhrq8jwbu4wpipw66q2sqeb923"
              identifier={C.visualization('Revenue by Region')}
              config={{
                  colors: ['rgba(195, 49, 73, 1)', 'rgba(168, 194, 86, 1)'],
                  legend: {
                      enabled: true,
                      position: 'bottom'
                  }
              }}
          />
          <h3>This is a GoodData component for bar charts: </h3>
          <BarChart
              afm={{
                  measures: [
                      {
                          id: 'CustomMeasureID',
                          definition: {
                              baseObject: {
                                  id: 'acKjadJIgZUN' // can be referenced from the exported catalog
                              }
                          }
                      }
                  ],
                  attributes: [
                      {
                          id: 'label.activity.type'
                      }
                  ]
              }}
              projectId="la84vcyhrq8jwbu4wpipw66q2sqeb923"
              transformation={{
                  measures: [
                      {
                          id: 'CustomMeasureID',
                          title: '# of Activities'
                      }
                  ]
              }}
          />
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
