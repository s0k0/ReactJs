import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//fetch component from gooddata SDK
import { Kpi } from '@gooddata/react-components';
import '@gooddata/react-components/styles/css/main.css';

//loading data from your project on gooddata with all attributes and store them in a json file by using
// > gdc-catalog-export --project-id la84vcyhrq8jwbu4wpipw66q2sqeb923 --username <your-gooddata-username> --password <your-password> --output src/catalog.json
import { CatalogHelper } from '@gooddata/react-components';
import catalogJson from './catalog.json';
const C = new CatalogHelper(catalogJson);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React, servant!</h1>
        </header>
          <h3>This is a GoodData component: </h3>
          <Kpi
              projectId="la84vcyhrq8jwbu4wpipw66q2sqeb923"
              measure="atSHqCtAePe4" />
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
