import React, {Component} from 'react';
import 'components/ClustersTable.css';
import ClustersTableBody from 'components/ClustersTableBody.js';

class ClustersTable extends Component {
    render() {
        return (
            <table className="ClustersTable">
                <thead className="thead-light row-bg-dark">
                <tr>
                    <th>Cluster/Mesh Name</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Last seen</th>
                    <th/>
                </tr>
                </thead>
                <ClustersTableBody clusters={this.props.clusters} tick={this.props.tick}/>
            </table>
        );
    }
}

export default ClustersTable;
