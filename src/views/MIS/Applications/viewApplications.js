import React from 'react';
import { withRouter } from '../../../withRouter';
import CustomTable from '../../../components/CustomTable';
import { user } from '../../../objects/User';
import { CircularProgress, Grid, Typography, Tabs, Tab, Card } from '@mui/material';
import { socket } from '../../../websocket/socket';

class ViewApplications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingApplications: false,
            submittedApplicationsArr: [],
            receivedApplicationsArr: [],
            forwardedApplicationsArr: [],
            
            tabIndex: 0,
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
                    forwardedApplicationsArr: res.data.filter(app => app.forwarded_to.some(user => user.user_id == user?.user_id)),
                    loadingApplications: false,
                });
            }
        });
    }

    tableColumns = () => [
        { id: "application_title", label: "Title", format: (value) => value },
        {   id:  'tbd', 
            label: this.state.tabIndex == 0 ? 'Sent to' : 
                this.state.tabIndex == 1 ? 'Received From' : 
                this.state.tabIndex == 2 ? 'Forwarded By' : '', 
            format: (value) => value 
        },
        { id: "status", label: "Status", format: (value) => value },
        { id: "tbd", label: "Body", format: (value) => JSON.stringify(value) },
    ];

    render() {
        return (
            this.state.loading ? <CircularProgress /> :
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant='h3'>My Applications</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Tabs value={this.state.tabIndex} onChange={(e, newIndex) => this.setState({tabIndex: newIndex})} aria-label="basic tabs example">
                        <Tab label="Submitted"/>
                        <Tab label="Received" />
                        <Tab label="Forwarded to me" />
                    </Tabs>
                </Grid>
                <Grid item xs={12}>
                    <CustomTable
                        maxWidth={'100%'}
                        loadingState={this.state.loadingApplications}
                        viewButtonLabel='View Application'
                        onRowClick={(application) =>
                            this.props.navigate("detail", {
                                state: { application_id: application.application_id },
                            })
                        }
                        onViewClick={(application) =>
                            this.props.navigate("detail", {
                                state: { application_id: application.application_id },
                            })
                        }
                        rows={
                            this.state.tabIndex == 0 ? this.state.submittedApplicationsArr : 
                            this.state.tabIndex == 1 ? this.state.receivedApplicationsArr : 
                            this.state.tabIndex == 2 ? this.state.forwardedApplicationsArr : 
                            []
                        }
                        columns={this.tableColumns()}
                    />
                    
                </Grid>
            </Grid>
        )
    }
}

export default withRouter(ViewApplications);