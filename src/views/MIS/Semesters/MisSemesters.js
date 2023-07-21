/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  ButtonGroup
} from "@mui/material";
import { Delete, Edit } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { socket } from "../../../websocket/socket";
import { withRouter } from "../../../withRouter";
import CustomTable from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import ConfirmationModal from "../../../components/ConfirmationModal";
import GoBackButton from "../../../components/GoBackButton";
import CustomCard from "../../../components/CustomCard";
import { timeLocale } from "../../../objects/Time";
import { convertUpper } from "../../../extras/functions";
import ContextInfo from "../../../components/ContextInfo";
import { getUserNameById } from "../../../objects/Users_List";

class MisSemesters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingSemesters: true,
      semestersArr: [],

      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => { }
    };
  }

  componentDidMount() {
    socket.emit("semesters/fetch", {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          semestersArr: res.data,
          loadingSemesters: false,
        });
      }
    });

    socket.addEventListener('semesters/listener/insert', this.semestersListenerInsert)
    socket.addEventListener('semesters/listener/update', this.semestersListenerUpdate)
    socket.addEventListener('semesters/listener/delete', this.semestersListenerDelete)
  }

  componentWillUnmount() {
    socket.removeEventListener('semesters/listener/insert', this.semestersListenerInsert)
    socket.removeEventListener('semesters/listener/update', this.semestersListenerUpdate)
    socket.removeEventListener('semesters/listener/delete', this.semestersListenerDelete)
  }

  semestersListenerInsert = (data) => {
    return this.setState({
      semestersArr: [data, ...this.state.semestersArr]
    })
  }
  semestersListenerUpdate = (data) => {
    return this.setState(state => {
      const semestersArr = state.semestersArr.map((semester, index) => {
        if (semester.semester_id === data.semester_id) return data;
        else return semester
      });
      return {
        semestersArr,
      }
    });
  }
  semestersListenerDelete = (data) => {
    return this.setState({
      semestersArr: this.state.semestersArr.filter((semester) => semester.semester_id != data.semester_id)
    })
  }

  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => { }
    })
  }

  render() {
    const columns = [
      { id: "semester_season", label: "Season", format: (value) => convertUpper(value) },
      { id: "semester_year", label: "Year", format: (value) => value },
      { id: 'semester_start_timestamp', label: 'Starts', format: (value) => new Date(Number(value)).toLocaleDateString(...timeLocale) },
      { id: 'semester_end_timestamp', label: 'Ends', format: (value) => new Date(Number(value)).toLocaleDateString(...timeLocale) },
      { id: "semester_coordinator_id", label: "Semester Coordinator", format: (value) => getUserNameById(value) },
      { id: "offered_courses", label: "Offered Courses", format: (value) => value },
    ];
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ContextInfo contextInfo={{ department_name: 'Computer Science & Information Technology' }} />
        </Grid>
        <Grid item xs={12}>
          <CustomCard>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h2">
                  Semesters
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTable
                  loadingState={this.state.loadingSemesters}
                  viewButtonLabel='Manage Courses'
                  onViewClick={(semester) =>
                    this.props.navigate('courses', {
                      state: {
                        ...this.props.location.state,
                        semester_id: semester.semester_id,
                        context_info: semester
                      }
                    })}
                  onRowClick={(semester) =>
                    this.props.navigate('courses', {
                      state: {
                        ...this.props.location.state,
                        semester_id: semester.semester_id,
                        context_info: semester
                      }
                    })}
                  onEditClick={(semester) => this.props.navigate('update', { state: { semester_id: semester.semester_id } })}
                  onDeleteClick={(semester) => {
                    this.setState({
                      confirmationModalShow: true,
                      confirmationModalMessage: 'Are you sure you want to remove this semester?',
                      confirmationModalExecute: () => socket.emit('semesters/delete', { semester_id: semester.semester_id })
                    })
                  }}
                  rows={this.state.semestersArr}
                  columns={columns}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomButton
                  onClick={() => this.props.navigate("create")}
                  label="Create New"
                />
              </Grid>
              <ConfirmationModal
                open={this.state.confirmationModalShow}
                message={this.state.confirmationModalMessage}
                onClose={() => this.confirmationModalDestroy()}
                onClickNo={() => this.confirmationModalDestroy()}
                onClickYes={() => {
                  this.state.confirmationModalExecute()
                  this.confirmationModalDestroy()
                }}
              />
            </Grid>
          </CustomCard>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisSemesters);
