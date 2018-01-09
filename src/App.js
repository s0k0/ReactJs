import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//load d3js dependencies
import * as d3 from 'd3'
import { scaleLinear, scaleTime } from 'd3-scale'
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
const {  LineChart} = AfmComponents; //current options for charts at good data sdk
const afm = {
    measures: [
        {
            id: 'Brand GMV %',
            definition: {
                baseObject: {
                    id: 'acoFUgsTiD6W' // can be referenced from the exported catalog
                }
            }
        }
    ],
    attributes: [
        {
            id: 'day.date.yyyymmdd',
            type: 'date'
        }
    ],
    filters: [
        {
            id: 'day.dataset.dt',
            type: 'date',
            intervalType: 'relative',
            between: [ -2, 0 ],
            granularity: 'month'
        }
    ]
};
const projectId = "xxs0z4goly0aisusjzyl1m1tmvzfiyuo"; //Zalando sample project ID


//start the app
/*const projectId = "la84vcyhrq8jwbu4wpipw66q2sqeb923"; //GoodData sample project ID
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
};*/
const transformation = {};
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
        config.setCustomDomain('https://zalando-development.eu.gooddata.com');

        //connect directly to the project data layer
        const adapter = new SimpleExecutorAdapter(sdk, projectId);
        const dataTable = new DataTable(adapter);

        //define what to do with callbacks for success and failed data request
        dataTable.onData((data) => {
                console.log(data);
                this.setState({data: data}); //load data from GoodData API into component state
                this.createChartD3js()
            }
        );
        dataTable.onError((err) => console.error(err));

        //executing data request with given attribute-filter-model (afm) format and transformation
        dataTable.getData(afm, transformation);
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
    renderChartD3js(){
        return <svg ref={node => this.node = node}
                    width={500} height={500}>

        </svg>
    }

    //create bar chart using D3js
    createChartD3js() {
        const node = this.node
        const size =[400,400]
        const margin = {top: 20, right:20, bottom:30, left:40}
        const parseTime = d3.timeParse("%Y-%m-%d");
        const data = this.state.data.rawData.map((item) => {
            return { date: parseTime(item[0].name) , value: parseFloat(item[1]).toFixed(5) };
        });

        const yScale = scaleLinear()
            .domain([min(data,(d) => { return d.value; } ), max(data,(d) => { return d.value; } )])
            .range([size[1],0])

        const xScale = scaleTime()
            .domain(d3.extent(data, (d) => { return d.date; }))
            .range([margin.left, size[0] - margin.right])

        let yAxis = axisLeft(yScale)
        let xAxis = axisBottom(xScale)

        const line = d3.line()
            .x((d) => { return xScale(d.date); })
            .y((d) => { return yScale(d.value); })


        console.log(data);


        select(node)
            .selectAll('svg')

        select(node)
            .append('path')
            .data([data])
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);

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
            <div className="App-body" style={{ display: 'flex', justifyContent: 'space-around'}}>
                <div className="Custom-Chart" style={{ width: '100%'}}>
                   {/* <h3>This is a GoodData raw: </h3>
                     {this.state.data ? this.dataObject() : 'not there yet' }*/}
                    <h3>This is a GoodData raw as D3Js line chart: </h3>
                    {this.state.data? this.renderChartD3js() : 'not there yet' }
                </div>
                <div className="SDK-Chart" style={{ width: '100%'}}>
                <h3>This is a GoodData component for line chart: </h3>
                  <div style={{height: 400, width: 600}}>
                    <LineChart
                        afm={afm}
                        projectId= {projectId}
                        transformation={{}}
                    />
                  </div>
                </div>
            </div>
          </div>
        );
    }
}

export default App;
