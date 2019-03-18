import React, {Component} from 'react';
import ApiClient from 'utils/api-client/api-client';
import Logger from 'utils/logger/logger';
import switchOffImg from 'img/switch-off.png';
import switchOnImg from 'img/switch-on.png';

let logger = Logger.getLoggerWithLevel("ServicesRow", Logger.DEBUG);

class ServicesRow extends Component {
    constructor(props) {
        super(props);
        this.onToggleClicked = this.onToggleClicked.bind(this);
    }

    async onToggleClicked(clusterGuid, serviceName, targetState) {
        logger.debug(">> onToggleClicked", clusterGuid, serviceName, targetState);
        await ApiClient.updateClusterPolicy(clusterGuid, serviceName, targetState);
        this.props.tick();
        logger.debug("<< onToggleClicked");
    }

    render() {
        const rowBgClass = (this.props.idx % 2 === 0) ? "row-bg-light" : "row-bg-dark";
        const cluster = this.props.cluster;
        const services = cluster.services;

        const rows = Object.keys(services).map((key, idx) =>
            <tr key={idx} className={rowBgClass}>
                <td/>
                <td>{services[key].namespace}</td>
                <td>{services[key].name}</td>
                <td colSpan="2">
                    <img className='switch-button'
                         alt="switch button"
                         src={services[key].protectionEnabled ? switchOnImg : switchOffImg}
                         onClick={() => this.onToggleClicked(cluster.guid, key, !services[key].protectionEnabled)}
                    />
                </td>
            </tr>
        );

        return (
            <React.Fragment>
                <tr className={rowBgClass + " row-bottom-border"}>
                    <td/>
                    {(Object.entries(this.props.cluster.services).length > 0) ?
                        (
                            <React.Fragment>
                                <td>Namespace</td>
                                <td>Service</td>
                                <td colSpan="2">Protect with App ID</td>
                            </React.Fragment>
                        ) : (
                            <td colSpan="4">No Services Reported</td>
                        )
                    }

                </tr>
                {rows}
            </React.Fragment>
        );
    }
}

export default ServicesRow;
