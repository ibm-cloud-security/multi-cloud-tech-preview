import React, {Component} from 'react';
import ApiClient from 'utils/api-client/api-client';
import deleteImg from 'img/delete.png';

class ClusterRow extends Component {
    constructor(props) {
        super(props);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
    }

    onDeleteClicked = async (guid) => {
        let sure = window.confirm("Are you sure???");
        if (!sure) return;

        await ApiClient.deleteCluster(guid);
        this.props.tick();
    };

    render() {
        const rowBgClass = (this.props.idx % 2 === 0) ? "row-bg-light" : "row-bg-dark";

        const seenSecondsAgo = (new Date() - new Date(this.props.cluster.lastActivityTimestamp)) / 1000;
        let lastSeenText;
        let statusIndicatorClass;

        if (seenSecondsAgo < 2) {
            lastSeenText = "Online";
            statusIndicatorClass = "status-green";
        } else if (seenSecondsAgo < 5) {
            lastSeenText = "A few seconds ago";
            statusIndicatorClass = "status-yellow";
        } else if (seenSecondsAgo < 15) {
            lastSeenText = "Over 5 seconds ago";
            statusIndicatorClass = "status-orange";
        } else {
            lastSeenText = "Disconnected";
            statusIndicatorClass = "status-red";
        }

        return (
            <tr className={rowBgClass}>
                <td style={{borderTop: "0px"}}>{this.props.cluster.name || 'Unknown'}</td>
                <td>{this.props.cluster.type || 'Unknown'}</td>
                <td>{this.props.cluster.location || 'Unknown'}</td>
                <td><span className={statusIndicatorClass}>● </span>{lastSeenText}</td>
                <td>
                    <img alt="delete" className="deleteButton" src={deleteImg}
                         onClick={() => this.onDeleteClicked(this.props.cluster.guid)}/>
                </td>
            </tr>
        );
    }
}

export default ClusterRow;
