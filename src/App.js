import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//load d3js dependencies
import { scaleLinear,scaleBand } from 'd3-scale'
import { max, min } from 'd3-array'
import { select } from 'd3-selection'
import { axisLeft, axisBottom } from 'd3-axis'

//get data layer access
import { DataTable, SimpleExecutorAdapter } from '@gooddata/data-layer';
import * as sdk from 'gooddata';
import { config } from 'gooddata';

//fetch react components for rendering charts or other visualizations
import { AfmComponents } from '@gooddata/react-components';
import '@gooddata/react-components/styles/css/main.css';


//define constants for parameter used by components
const { BarChart} = AfmComponents; //current options for charts at good data sdk
const afm = {
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
};
const transformation = {};
const projectId = "la84vcyhrq8jwbu4wpipw66q2sqeb923"; //GoodData sample project ID
//const projectId = "xxs0z4goly0aisusjzyl1m1tmvzfiyuo"; //Zalando sample project ID


//start the app
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: [],
            labels: []
        };
    }

    componentDidMount() {
        // load data from Zalando domain

       // config.setCustomDomain('https://zalando-development.eu.gooddata.com');

        //connect directly to the project data layer
        const adapter = new SimpleExecutorAdapter(sdk, projectId);
        const dataTable = new DataTable(adapter);

        //define what to do with callbacks for success and failed data request
        dataTable.onData((data) => {
                console.log(data);
                this.setState({data: data}); //load data from GoodData API into component state
                this.assembleDataArray()
            }
        );
        dataTable.onError((err) => console.error(err));

        //executing data request with given attribute-filter-model (afm) format and transformation
        dataTable.getData(afm, transformation);
    }

    assembleDataArray(){
        const values = []
        const labels = []
        this.state.data.rawData.map((entry) => {
            labels.push(entry[0].name)
            values.push(parseInt(entry[1]))
        })
        this.setState({values: values})
        this.setState({labels: labels})
    }

    //deliver DOM element containing raw data provided request results
    dataObject(){
        return this.state.data.rawData.map((entry) => {
            return (
                <p style={{ textAlign: 'left', paddingLeft: '40%'}}>
                    <span> label: {entry[0].name} </span>,
                    <span> value: {entry[1]} </span>
                </p>
            )
        })
    }

    //deliver DOM element containing the bar chart created with D3js from raw data
    renderBarChartD3js(){
        this.createBarChartD3js()
        return <svg ref={node => this.node = node}
                    width={500} height={500}>

        </svg>
    }

    //create bar chart using D3js
    createBarChartD3js() {
        const node = this.node
        const size =[400,400]
        const valueMax = max(this.state.values)
        const margin = {top: 20, right:20, bottom:30, left:40}
        const yScale = scaleLinear()
            .domain([0,valueMax])
            .range([size[1],0])

        const xScale = scaleBand()
            .domain(this.state.labels)
            .range([margin.left, size[0] - margin.right])
            .padding(0.2)

        const barWidth = min([xScale.bandwidth(),margin.left])

        const yAxis = axisLeft(yScale)
        const xAxis = axisBottom(xScale)

        select(node)
            .selectAll('rect')
            .data(this.state.values)
            .enter()
            .append('rect')
            .attr('x', (d,i) => margin.left * 2 + i * barWidth * 2)
            .attr('y', d => yScale(d))
            .attr('height', d => yScale(0) - yScale(d))
            .attr('width', barWidth)
            .attr('fill', '#fe9922')

        select(node)
            .append("g")
            .attr("transform", "translate("+ margin.left +",0)")
            .call(yAxis)

        select(node)
            .append("g")
            .attr("transform", "translate(0,"+ size[0] +")")
            .call(xAxis)
    }

    render() {
        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React, servant!</h1>
            </header>
              <h3>This is a GoodData raw: </h3>
              {this.state.data ? this.dataObject() : 'not there yet' }
              <h3>This is a GoodData raw as D3Js bar chart: </h3>
              {this.state.data? this.renderBarChartD3js() : 'not there yet' }
              <h3>This is a GoodData component for bar charts </h3>
              <BarChart
                  afm={afm}
                  projectId= {projectId}
                  transformation={{
                      measures: [
                          {
                              id: 'CustomMeasureID',
                              title: '# of Activities'
                          }
                      ]
                  }}
              />
          </div>
        );
    }
}

export default App;
