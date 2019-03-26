import React, {Component} from 'react';
import 'components/App.css';
import ApiClient from 'utils/api-client/api-client';
import ClustersTable from 'components/ClustersTable.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.clusters = [];
        this.state.timestamp = new Date().toLocaleTimeString();
    }

    componentDidMount() {
        this.ticker = setInterval(() => this.tick(), 2000);
        this.tick();
    }

    componentWillUnmount() {
        clearInterval(this.ticker);
    }

    async tick() {
        this.setState({
            clusters: await ApiClient.getClusters(),
            timestamp: new Date().toLocaleTimeString()
        });
    }

    render() {
        return (
            <div className="App">
                <div className="Header">
                    <span>Multi-Cloud Identity and Access Control Policy Manager - Technical Preview</span>
                </div>
                <div className="ClustersTableContainer">
                    <ClustersTable clusters={this.state.clusters} tick={this.tick.bind(this)}/>
                    <span>Last updated: {this.state.timestamp}</span>
                </div>
            </div>
        );
    }
}

export default App;
