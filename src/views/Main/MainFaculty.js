import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, Tabs, Tab, Button, Container, Fade, Stack } from "@mui/material";
import { socket } from "../../websocket/socket";
import * as Color from '@mui/material/colors'
import LoadingIcon from "../../components/LoadingIcon";
import { getCache, setCache } from "../../localStorage";
import { withRouter } from "../../withRouter";

class MainFaculty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingApi: 'fetchData',
      teachersArr: [],
    };
  }

  componentDidMount() {
    this.fetchData()
  }

  setCallingApi = (value) => this.setState({ callingApi: value })

  fetchData = () => {
    this.setCallingApi('fetchData')

    const cachedData = getCache('teachers/fetch')
    if (cachedData) return this.setState({ teachersArr: this.filterTeachers(cachedData), callingApi: '' })

    socket.emit('teachers/fetch', {}, (res) => {
      if (res.code == 200) {
        this.setState({ teachersArr: this.filterTeachers(res.data), callingApi: '' })
        setCache('teachers/fetch', res.data)
      } else console.error(res)
    })
  }

  filterTeachers = (arr) => {
    const newarr = arr.filter(t => t.teacher_department_id == 'CS&IT')
      .filter(t => !t.teacher_name.includes('teacher') && t.teacher_name != 'Not determined')
      .sort((a, b) => a.teacher_name > b.teacher_name ? -1 : 1)
      .sort((a, b) => a.teacher_name.includes('Dr.') ? -1 : 1)

      console.log(newarr)
      return newarr
  }

  sortDesignations = (arr) => {

  }

  render() {
    return (
      this.state.callingApi == 'fetchData' ? <Box minHeight={'90vh'}><LoadingIcon minHeight='90vh' /></Box> :
        <Grid container padding={2} spacing={2} minHeight={'90vh'} justifyContent={'center'} alignItems={'center'} display='flex'>
          <Grid item xs={12} justifyContent={'center'} display='flex'>
            <Typography fontWeight={'bold'} variant="h2" sx={{ color: 'primary.main' }}>Faculty</Typography>
          </Grid>
          {['Dean','Assistant to Dean','Assistant Professor','Lecturer'].map((designation,index) => {
            return (
              <React.Fragment key={index}>
                  <Grid item xs={12}>
                    <Typography fontWeight={'bold'} variant="h4" sx={{ color: 'primary.dark' }}>{designation}</Typography>
                  </Grid>
                  {this.state.teachersArr.filter(t => (t.designation || 'Lecturer') == designation).map((t, index) => {
                    return (
                      <Fade key={index} in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Grid item container ml={{xs: 1, md: 2}} >
                          <Grid item xs={7} md={3}>
                          <Typography>{t.teacher_name}</Typography>
                          </Grid>
                          <Grid item xs={5} md={3}>
                          <Typography>{t.qualification}</Typography>
                          </Grid>
                        </Grid>
                      </Fade>
                    )
                  })}
              </React.Fragment>
            )
            return
          })}
        </Grid>
    );
  }
}


export default withRouter(MainFaculty);
