import React from 'react';
import { withRouter } from '../../../withRouter';
import CustomTable from '../../../components/CustomTable';
import { user } from '../../../objects/User';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { socket } from '../../../websocket/socket';

class ViewApplications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingApplications: false,
            receivedApplicationsArr: [],
            submittedApplicationsArr: [],
            forwardedApplicationsArr: [],
            
            application_type: 'submitted'
        }
    }

    componentDidMount() {
        this.fetchApplications()
        socket.addEventListener("applications/listener/insert", this.fetchApplications);
        socket.addEventListener("applications/listener/update", this.fetchApplications);
        socket.addEventListener("applications/listener/delete", this.fetchApplications);
    }

    componentWillUnmount() {
        socket.removeEventListener("applications/listener/insert", this.fetchApplications);
        socket.removeEventListener("applications/listener/update", this.fetchApplications);
        socket.removeEventListener("applications/listener/delete", this.fetchApplications);
    }

    fetchApplications = () => {
        this.setState({loadingApplications: true})
        socket.emit("applications/fetch", {}, (res) => {
            if (res.code == 200) {
                return this.setState({
                    submittedApplicationsArr: res.data.filter(app => app.submitted_by == user?.user_id),
                    receivedApplicationsArr: res.data.filter(app => app.submitted_to == user?.user_id),
                    loadingApplications: false,
                });
            }
        });
    }

    tableColumns = [
        { id: "application_title", label: "Title", format: (value) => value },
        { id: "status", label: "Status", format: (value) => value },
        { id: "detail_structure", label: "Body", format: (value) => JSON.stringify(value) },
    ];

    render() {
        return (
            this.state.loading ? <CircularProgress /> :
            <Grid container>
                <Grid item xs={12}>
                    <Typography>My Applications</Typography>
                </Grid>
                <Grid item xs={12}>
                    <CustomTable
                        loadingState={this.state.loadingApplications}
                        onViewClick={(application) =>
                            this.props.navigate("detail", {
                                state: { application_id: application.application_id },
                            })
                        }
                        rows={this.state.application_type == 'received' ? this.state.receivedApplicationsArr : this.state.application_type == 'submitted' ? this.state.submittedApplicationsArr : []}
                        columns={this.tableColumns}
                    />
                </Grid>
            </Grid>
        )
    }
}

export default withRouter(ViewApplications);