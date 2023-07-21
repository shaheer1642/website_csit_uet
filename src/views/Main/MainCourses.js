import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, Tabs, Tab, Button, Container, Fade, Stack } from "@mui/material";
import { socket } from "../../websocket/socket";
import * as Color from '@mui/material/colors'
import LoadingIcon from "../../components/LoadingIcon";
import { getCache, setCache } from "../../localStorage";
import { withRouter } from "../../withRouter";

class MainCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingApi: 'fetchData',
      coursesArr: []
    };
  }

  componentDidMount() {
    this.fetchData()
  }

  setCallingApi = (value) => this.setState({ callingApi: value })

  fetchData = () => {
    this.setCallingApi('fetchData')

    const cachedData = getCache('courses/fetch')
    if (cachedData) return this.setState({ coursesArr: cachedData, callingApi: '' })

    socket.emit('courses/fetch', {}, (res) => {
      if (res.code == 200) {
        this.setState({ coursesArr: res.data, callingApi: '' })
        setCache('courses/fetch', res.data)
      } else console.error(res)
    })
  }

  render() {
    return (
      this.state.callingApi == 'fetchData' ? <Box minHeight={'90vh'}><LoadingIcon minHeight='90vh' /></Box> :
        <Grid container padding={2} spacing={2} minHeight={'90vh'} justifyContent={'center'} alignItems={'center'} display='flex'>
          <Grid item xs={12} justifyContent={'center'} display='flex'>
            <Typography fontWeight={'bold'} variant="h2" sx={{ color: 'primary.main' }}>Postgraduate Courses Offered</Typography>
          </Grid>
          {this.state.coursesArr.sort((a, b) => a.course_name > b.course_name ? -1 : 1).sort((a, b) => a.course_description ? -1 : 1).map((course, index) => {
            return (
              <Fade key={index} in={true} style={{ transitionDelay: `${index * 20}ms` }}>
                <Grid item container direction={'column'} key={index} xs={12} md={6} lg={4}>
                  <Grid item>
                    <Typography fontWeight={'bold'} variant="h4" sx={{ color: 'primary.dark' }}>{course.course_id} {course.course_name}</Typography>
                  </Grid>
                  <Grid item height={{ xs: undefined, md: course.course_description ? 350 : 50 }} overflow={'auto'} sx={{ "&::-webkit-scrollbar, & *::-webkit-scrollbar": { backgroundColor: '#FFFFFF', width: '10px', height: '10px' }, }}>
                    <Typography>{course.course_description}</Typography>
                  </Grid>
                </Grid>
              </Fade>
            )
          })}
        </Grid>
    );
  }
}


export default withRouter(MainCourses);
