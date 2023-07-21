import React from 'react';
import { withRouter } from '../../../withRouter';
import CustomTable from '../../../components/CustomTable';
import { CircularProgress, Grid, Typography, Tabs, Tab, Card } from '@mui/material';
import { socket } from '../../../websocket/socket';
import theme from '../../../theme';
import { getUserNameById } from '../../../objects/Users_List';
import * as Color from "@mui/material/colors";
import { convertUpper } from '../../../extras/functions';
import CustomCard from '../../../components/CustomCard';

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
        this.setState({ loadingApplications: true })
        socket.emit("applications/fetch", {}, (res) => {
            console.log(res)
            if (res.code == 200) {
                return this.setState({
                    submittedApplicationsArr: res.data.filter(app => app.submitted_by == this.props.user?.user_id),
                    receivedApplicationsArr: res.data.filter(app => app.submitted_to == this.props.user?.user_id),
                    forwardedApplicationsArr: res.data.filter(app => app.forwarded_to.some(forward => forward.receiver_id == this.props.user?.user_id)),
                    loadingApplications: false,
                });
            }
        });
    }

    tableColumns = () => [
        { id: "serial", label: "S #", format: (value) => value },
        { id: "application_title", label: "Title", format: (value) => value },
        {
            id: this.state.tabIndex == 0 ? 'submitted_to' :
                this.state.tabIndex == 1 ? 'submitted_by' : '',
            label: this.state.tabIndex == 0 ? 'Sent to' :
                this.state.tabIndex == 1 ? 'Received From' : '',
            format: (value) => getUserNameById(value)
        },
        {
            id: "status", label: "Status", format: (value) => value, valueFunc: (row) => {
                if (this.state.tabIndex == 2)
                    return convertUpper(row.forwarded_to.filter(forward => forward.receiver_id == this.props.user.user_id).pop().status)
                else return convertUpper(row.status)
            }
        },
    ];

    render() {
        return (
            this.state.loading ? <CircularProgress /> :
                <CustomCard>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h3'>My Applications</Typography>
                        </Grid>
                        {['admin', 'pga', 'teacher'].includes(this.props.user.user_type) ?
                            <Grid item xs={'auto'}>
                                <Tabs sx={{ border: 2, borderColor: 'primary.main', borderRadius: 5 }} value={this.state.tabIndex} onChange={(e, newIndex) => this.setState({ tabIndex: newIndex })}>
                                    <Tab label="Submitted" />
                                    <Tab label="Received" />
                                    <Tab label="Forwarded to me" />
                                </Tabs>
                            </Grid> : <></>
                        }
                        <Grid item xs={12}>
                            <CustomTable
                                margin={'0px'}
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
                                rowSx={(row) => {
                                    const status = this.state.tabIndex == 2 ? row.forwarded_to.filter(forward => forward.receiver_id == this.props.user.user_id).pop().status : row.status
                                    return status == 'approved' ? {
                                        backgroundColor: Color.green[100]
                                    } : status == 'rejected' ? {
                                        backgroundColor: Color.red[100]
                                    } : undefined
                                }}
                                footerText='Green = Approved\nRed = Rejected'
                            />

                        </Grid>
                    </Grid>
                </CustomCard>
        )
    }
}

export default withRouter(ViewApplications);