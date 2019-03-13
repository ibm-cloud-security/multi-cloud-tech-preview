import React, {Component} from 'react';
import ClusterRow from 'components/ClusterRow';
import ServicesRow from 'components/ServicesRow';

class ClustersTableBody extends Component {
    clusterArraySorter = (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    };

    render() {
        this.props.clusters.sort(this.clusterArraySorter);

        let rows = this.props.clusters.map((cluster, idx) =>
            <React.Fragment key={idx}>
                <ClusterRow cluster={cluster} idx={idx} tick={this.props.tick}/>
                <ServicesRow cluster={cluster} idx={idx} tick={this.props.tick}/>
            </React.Fragment>
        );

        return (
            <tbody id="ClustersTableBody">
                {rows}
            </tbody>
        );
    }
}

export default ClustersTableBody;
