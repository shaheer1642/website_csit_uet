/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  ButtonGroup,
  Zoom,
  Alert,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  CircularProgress,
  Collapse,
  Card
} from "@mui/material";
import { ArrowDownward, ArrowRight, Delete, Edit, ExpandLess, ExpandMore } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { socket } from "../../../../websocket/socket";
import { withRouter } from "../../../../withRouter";
import CustomTable from "../../../../components/CustomTable";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import GoBackButton from "../../../../components/GoBackButton";
import CustomCard from "../../../../components/CustomCard";
import CustomTextField from "../../../../components/CustomTextField";
import LoadingIcon from "../../../../components/LoadingIcon";
import { convertUpper } from "../../../../extras/functions";


const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};


const defaultStyles = {
  container: {
    backgroundColor: 'white',
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)"
    ],
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
  },
  alertBox: {
    warning: {
      width: '100%',
      borderRadius: 0,
      color: palletes.alertWarning, // text color
      borderColor: palletes.alertWarning,
      my: '10px',
      py: "5px",
      px: "10px",
      '& .MuiAlert-icon': {
        color: palletes.alertWarning, // icon color
      },
    },
    success: {
      width: '100%',
      borderRadius: 0,
      color: palletes.alertSuccess, // text color
      borderColor: palletes.alertSuccess,
      my: '10px',
      py: "5px",
      px: "10px",
      '& .MuiAlert-icon': {
        color: palletes.alertSuccess, // icon color
      },
    }
  }
}

class MisGradeDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      semesterCourse: {},
      loadingSemesterCourse: true,

      alertMsg: '',
      alertSeverity: 'warning',

      callingApi: false,

      collapseOpen: false
    };
    this.sem_course_id = this.props.location.state.sem_course_id
    this.student_view = this.props.user.user_type == 'student'
  }

  componentDidMount() {
    this.fetchSemesterCourse();
    socket.addEventListener('semestersCourses/listener/changed', this.semestersCoursesListenerChanged)
  }

  componentWillUnmount() {
    socket.removeEventListener('semestersCourses/listener/changed', this.semestersCoursesListenerChanged)
  }


  semestersCoursesListenerChanged = (data) => {
    if (data.sem_course_id == this.sem_course_id)
      this.fetchSemesterCourse()
  }

  fetchSemesterCourse = () => {
    socket.emit("semestersCourses/fetch", { sem_course_id: this.sem_course_id }, (res) => {
      console.log(res)
      if (res.code == 200) {
        return this.setState({
          semesterCourse: res.data[0],
          loadingSemesterCourse: false,
        });
      }
    });
  }

  changeGradeDistribution = (key, value) => {
    console.log('changeGradeDistribution called')
    if (key != 'marking.type') {
      value = Number(value)
      if (!value) return
    }
    const semesterCourse = this.state.semesterCourse
    const keys = key.split('.')
    if (keys.length == 1)
      semesterCourse.grade_distribution[keys[0]] = value
    if (keys.length == 2)
      semesterCourse.grade_distribution[keys[0]][keys[1]] = value
    if (keys.length == 3)
      semesterCourse.grade_distribution[keys[0]][keys[1]][keys[2]] = value
    if (keys.length == 4)
      semesterCourse.grade_distribution[keys[0]][keys[1]][keys[2]][keys[3]] = value
    if (keys.length == 5)
      semesterCourse.grade_distribution[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = value
    if (keys.length == 6)
      semesterCourse.grade_distribution[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]] = value
    console.log('changeGradeDistribution keys length', keys.length)
    console.log('changeGradeDistribution new object', semesterCourse)
    this.setState({
      semesterCourse: {
        ...semesterCourse
      }
    })
  }

  render() {
    var timeoutAlertRef = null;
    function timeoutAlert() {
      console.log('timeoutAlert called')
      clearTimeout(timeoutAlertRef)
      timeoutAlertRef = setTimeout(() => this.setState({ alertMsg: '' }), 5000)
      console.log(timeoutAlertRef)
    }

    return (
      this.state.loadingSemesterCourse ? <LoadingIcon /> :
        <CustomCard>
          <Grid container spacing={2}>
            <Grid item xs={'auto'}>
              <Typography variant="h3"> Grade Distribution </Typography>
            </Grid>
            <Grid item xs={'auto'}>
              <IconButton onClick={() => this.setState((state) => ({ collapseOpen: !state.collapseOpen }))}>
                {this.state.collapseOpen ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Collapse in={this.state.collapseOpen}>
                <Grid container spacing={1} padding={2}>
                  <Grid item xs={"auto"} style={{ minWidth: '150px' }} alignItems='center' display={"flex"}>
                    <Typography variant="h4">Marking Type</Typography>
                  </Grid>
                  <Grid item xs={"auto"} style={{ minWidth: '150px' }} alignItems='center' display={"flex"}>
                    <RadioGroup
                      value={this.state.semesterCourse.grade_distribution.marking.type}
                      onChange={(e) => this.changeGradeDistribution('marking.type', e.target.value)}
                      row
                    >
                      <FormControlLabel value="absolute" control={<Radio disabled={this.state.semesterCourse.grades_locked || this.student_view} />} label="Absolute" />
                      <FormControlLabel value="relative" control={<Radio disabled={this.state.semesterCourse.grades_locked || this.student_view} />} label="Relative" />
                    </RadioGroup>
                    {this.state.semesterCourse.grade_distribution.marking.type == 'relative' ?
                      <CustomTextField
                        disabled={this.state.semesterCourse.grades_locked || this.student_view}
                        type='number'
                        size="small"
                        style={{ width: '120px' }}
                        required={true}
                        value={this.state.semesterCourse.grade_distribution.marking.average_top}
                        variant="filled"
                        label="Top Average %"
                        range={[1, 100]}
                        onChange={(e) => this.changeGradeDistribution('marking.average_top', e.target.value)}
                        onFocus={e => {
                          e.target.select();
                        }}
                      /> : <></>
                    }
                  </Grid>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={"auto"} style={{ minWidth: '150px' }} alignItems='center' display={"flex"}>
                    <Typography variant="h4">Final Term</Typography>
                  </Grid>
                  <Grid item xs={"auto"}>
                    <CustomTextField
                      disabled={this.state.semesterCourse.grades_locked || this.student_view}
                      type='number'
                      size="small"
                      style={{ width: '100px' }}
                      required={true}
                      value={this.state.semesterCourse.grade_distribution.final_term.weightage}
                      variant="filled"
                      label="Weightage %"
                      range={[0, 100]}
                      onChange={(e) => this.changeGradeDistribution('final_term.weightage', e.target.value)}
                      onFocus={e => {
                        e.target.select();
                      }}
                    />
                  </Grid>
                  <Grid item xs={"auto"}>
                    <CustomTextField
                      disabled={this.state.semesterCourse.grades_locked || this.student_view}
                      type='number'
                      size="small"
                      style={{ width: '100px' }}
                      required={true}
                      value={this.state.semesterCourse.grade_distribution.final_term.total_marks}
                      variant="filled"
                      label="Total Marks"
                      range={[0, 100]}
                      onChange={(e) => this.changeGradeDistribution('final_term.total_marks', e.target.value)}
                      onFocus={e => {
                        e.target.select();
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={"auto"} style={{ minWidth: '150px' }} alignItems='center' display={"flex"}>
                    <Typography variant="h4">Mid Term</Typography>
                  </Grid>
                  <Grid item xs={"auto"}>
                    <CustomTextField
                      disabled={this.state.semesterCourse.grades_locked || this.student_view}
                      type='number'
                      size="small"
                      style={{ width: '100px' }}
                      required={true}
                      value={this.state.semesterCourse.grade_distribution.mid_term.weightage}
                      variant="filled"
                      label="Weightage %"
                      range={[0, 100]}
                      onChange={(e) => this.changeGradeDistribution('mid_term.weightage', e.target.value)}
                      onFocus={e => {
                        e.target.select();
                      }}
                    />
                  </Grid>
                  <Grid item xs={"auto"}>
                    <CustomTextField
                      disabled={this.state.semesterCourse.grades_locked || this.student_view}
                      type='number'
                      size="small"
                      style={{ width: '100px' }}
                      required={true}
                      value={this.state.semesterCourse.grade_distribution.mid_term.total_marks}
                      variant="filled"
                      label="Total Marks"
                      range={[0, 100]}
                      onChange={(e) => this.changeGradeDistribution('mid_term.total_marks', e.target.value)}
                      onFocus={e => {
                        e.target.select();
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={"auto"} style={{ minWidth: '150px' }} alignItems='center' display={"flex"}>
                    <Typography variant="h4">Sessional</Typography>
                  </Grid>
                  <Grid item xs={"auto"}>
                    <CustomTextField
                      disabled={this.state.semesterCourse.grades_locked || this.student_view}
                      type='number'
                      size="small"
                      style={{ width: '100px' }}
                      required={true}
                      value={this.state.semesterCourse.grade_distribution.sessional.weightage}
                      variant="filled"
                      label="Weightage %"
                      range={[0, 100]}
                      onChange={(e) => this.changeGradeDistribution('sessional.weightage', e.target.value)}
                      onFocus={e => {
                        e.target.select();
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}></Grid>
                  {Object.values(this.state.semesterCourse.grade_distribution.sessional.division).map((division, index) => {
                    const key = Object.keys(this.state.semesterCourse.grade_distribution.sessional.division)[index]
                    return (
                      key == 'assignments' ?
                        <React.Fragment key={`fragment-${index}`}>
                          <Grid item xs={"auto"} style={{ minWidth: '200px', marginLeft: '50px' }} alignItems='center' display={"flex"}>
                            <Checkbox
                              disabled={this.state.semesterCourse.grades_locked || this.student_view}
                              key={`checkbox-${index}`}
                              checked={division.include}
                              onChange={(e) => this.changeGradeDistribution(`sessional.division.${key}.include`, e.target.checked)}
                            />
                            <Typography key={`text-${index}`} variant="h6">{convertUpper(key)}</Typography>
                          </Grid>
                          <Grid item xs={"auto"}>
                            <CustomTextField
                              disabled={this.state.semesterCourse.grades_locked || this.student_view}
                              type='number'
                              size="small"
                              style={{ width: '200px' }}
                              required={true}
                              value={division.total_marks_per_assignment}
                              variant="filled"
                              label="Total Marks Per Assignment"
                              range={[0, 100]}
                              onChange={(e) => this.changeGradeDistribution(`sessional.division.${key}.total_marks_per_assignment`, e.target.value)}
                              onFocus={e => {
                                e.target.select();
                              }}
                            />
                          </Grid>
                          <Grid item xs={"auto"}>
                            <CustomTextField
                              disabled={this.state.semesterCourse.grades_locked || this.student_view}
                              type='number'
                              size="small"
                              style={{ width: '150px' }}
                              required={true}
                              value={division.no_of_assignments}
                              variant="filled"
                              label="No of Assignments"
                              range={[0, 100]}
                              onChange={(e) => this.changeGradeDistribution(`sessional.division.${key}.no_of_assignments`, e.target.value)}
                              onFocus={e => {
                                e.target.select();
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}></Grid>
                        </React.Fragment>
                        : key == 'quizzes' ?
                          <React.Fragment key={`fragment-${index}`}>
                            <Grid item xs={"auto"} style={{ minWidth: '200px', marginLeft: '50px' }} alignItems='center' display={"flex"}>
                              <Checkbox
                                disabled={this.state.semesterCourse.grades_locked || this.student_view}
                                key={`checkbox-${index}`}
                                checked={division.include}
                                onChange={(e) => this.changeGradeDistribution(`sessional.division.${key}.include`, e.target.checked)}
                              />
                              <Typography key={`text-${index}`} variant="h6">{convertUpper(key)}</Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                              <CustomTextField
                                disabled={this.state.semesterCourse.grades_locked || this.student_view}
                                type='number'
                                size="small"
                                style={{ width: '200px' }}
                                required={true}
                                value={division.total_marks_per_quiz}
                                variant="filled"
                                label="Total Marks Per Quiz"
                                range={[0, 100]}
                                onChange={(e) => this.changeGradeDistribution(`sessional.division.${key}.total_marks_per_quiz`, e.target.value)}
                                onFocus={e => {
                                  e.target.select();
                                }}
                              />
                            </Grid>
                            <Grid item xs={"auto"}>
                              <CustomTextField
                                disabled={this.state.semesterCourse.grades_locked || this.student_view}
                                type='number'
                                size="small"
                                style={{ width: '150px' }}
                                required={true}
                                value={division.no_of_quizzes}
                                variant="filled"
                                label="No of Quizzes"
                                range={[0, 100]}
                                onChange={(e) => this.changeGradeDistribution(`sessional.division.${key}.no_of_quizzes`, e.target.value)}
                                onFocus={e => {
                                  e.target.select();
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}></Grid>
                          </React.Fragment>
                          :
                          <React.Fragment key={`fragment-${index}`}>
                            <Grid item xs={"auto"} style={{ minWidth: '200px', marginLeft: '50px' }} alignItems='center' display={"flex"}>
                              <Checkbox
                                disabled={this.state.semesterCourse.grades_locked || this.student_view}
                                key={`checkbox-${index}`}
                                checked={division.include}
                                onChange={(e) => this.changeGradeDistribution(`sessional.division.${key}.include`, e.target.checked)}
                              />
                              <Typography key={`text-${index}`} variant="h6">{convertUpper(key)}</Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                              <CustomTextField
                                disabled={this.state.semesterCourse.grades_locked || this.student_view}
                                type='number'
                                size="small"
                                style={{ width: '100px' }}
                                required={true}
                                value={division.total_marks}
                                variant="filled"
                                label="Total Marks"
                                range={[0, 100]}
                                onChange={(e) => this.changeGradeDistribution(`sessional.division.${key}.total_marks`, e.target.value)}
                                onFocus={e => {
                                  e.target.select();
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}></Grid>
                          </React.Fragment>
                    )
                  })}
                  <Grid item xs={12}>
                    <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                      <Alert variant="outlined" severity={this.state.alertSeverity} sx={defaultStyles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                    </Zoom>
                  </Grid>
                  {this.state.semesterCourse.grades_locked || this.student_view ? <></> :
                    <React.Fragment>
                      <Grid item xs={"auto"}>
                        <CustomButton
                          label={this.state.callingApi ? <CircularProgress size='20px' /> : "Save"}
                          disabled={this.state.callingApi}
                          onClick={() => {
                            this.setState({ callingApi: true })
                            socket.emit(`semestersCourses/updateGradeDistribution`, { sem_course_id: this.sem_course_id, grade_distribution: this.state.semesterCourse.grade_distribution }, res => {
                              this.setState({ callingApi: false })
                              this.setState({
                                alertMsg: res.code == 200 ? 'Updated grade distribution' : `${res.status}: ${res.message}`,
                                alertSeverity: res.code == 200 ? 'success' : 'warning'
                              }, timeoutAlert)
                            })
                          }}
                        />
                      </Grid>
                      <Grid item xs={"auto"}>
                        <CustomButton
                          label="Reset"
                          onClick={() => this.fetchSemesterCourse()}
                        />
                      </Grid>
                    </React.Fragment>
                  }
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
        </CustomCard>
    )
  }
}

export default withRouter(MisGradeDistribution);
