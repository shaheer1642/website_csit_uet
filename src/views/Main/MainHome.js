import Typography from "@mui/material/Typography";
import { Box, Grid, Tabs, Tab, Button, Container, Collapse, Fade, Zoom } from "@mui/material";
import { socket } from "../../websocket/socket";
import * as Color from '@mui/material/colors'
import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/system';
import { withRouter } from "../../withRouter";

function AnimatedText(props) {
  const { children, value, index, delay, Transition, ...other } = props;

  return (
    delay && Transition ?
      <Transition orientation="horizontal" style={{ transitionDelay: delay }} in={true}>
        <Typography {...other}>{children}</Typography>
      </Transition>
      : <Typography {...other}>{children}</Typography>
  );
}

class MainHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      eventsArr: [],
      currentImageIndex: 0
    };
    this.interval = null;
    this.images = [
      'https://www.uetpeshawar.edu.pk/images/csit4.png',
      'https://www.uetpeshawar.edu.pk/images/csit2.png',
      'https://www.uetpeshawar.edu.pk/images/csit3.png',
      'https://www.uetpeshawar.edu.pk/images/csit7.png',
    ];
  }

  componentDidMount() {
    socket.emit("events/fetch", {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          eventsArr: res.data,
        });
      }
    });

    socket.addEventListener(
      "events/listener/insert",
      this.eventsListenerInsert
    );
    socket.addEventListener(
      "events/listener/delete",
      this.eventsListenerDelete
    );

    // Automatically advance to the next image every 3 seconds
    this.interval = setInterval(() => {
      this.setState((prevState) => ({ currentImageIndex: (prevState.currentImageIndex + 1) % this.images.length }))
    }, 5000);
  }

  componentWillUnmount() {
    socket.removeEventListener(
      "events/listener/insert",
      this.eventsListenerInsert
    );
    socket.removeEventListener(
      "events/listener/delete",
      this.eventsListenerDelete
    );
    clearInterval(this.interval);
  }

  eventsListenerInsert = (res) => {
    if (res.code == 200) {
      return this.setState({
        eventsArr: [...this.state.eventsArr, res.data],
      });
    }
  };
  eventsListenerDelete = (res) => {
    if (res.code == 200) {
      return this.setState({
        eventsArr: this.state.eventsArr.filter(
          (event) => event.event_id != res.data.event_id
        ),
      });
    }
  };

  render() {
    return (
      <Grid item container minHeight={'90vh'} sx={{ backgroundImage: `url(${this.images[this.state.currentImageIndex]})`, backgroundSize: 'cover', transition: '1s' }}>
        {/* <Grid item xs={12}>
          <Slideshow />
        </Grid> */}
        <Grid item xs={12} padding={2} pt={10} sx={{ backgroundColor: alpha(Color.grey[900], 0.7) }}>
          <Grid item container spacing={1}>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <AnimatedText Transition={Fade} delay='100ms' color='secondary' variant="h2" fontWeight={'bold'} style={{textShadow: `3px 3px 4px black`}}>
                Department Of Computer Science & Information Technology Peshawar Campus
              </AnimatedText>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <AnimatedText Transition={Fade} delay='300ms' color='secondary' variant="h5">
                The Department of Computer Science & Information Technology offers
                undergraduate and postgraduate courses leading to the award of Bachelor
                of Science, Master of Science in Computer Science, and Ph.D. in Computer Science respectively.
                It owes its emergence to the relentlessly growing demand of
                professionals with expertise in areas of computers, communications
                and information processing technologies. The Department of CS & IT
                enjoys full support of the engineering departments. Students work in
                laboratories equipped with state-of-art computer systems running a
                wide range of applications and specialized software supporting the
                courses. The department strongly supports the idea of using modern
                audio visual aids to enhance the learning capabilities of students
                and provides them a stimulating and challenging environment
                essential for high quality education. The graduates of this
                department will be able to meet the highest standards of training
                for leadership in computer science and information technology and to
                capitalize on the huge IT market of the 21st century. The Department
                of Computer Science & Information Technology is concerned with the
                theory, design, development of computer Science & Information
                processing techniques.
              </AnimatedText>
            </Grid>
            <Grid item container xs={12}>
              <Zoom in={true} style={{transitionDelay: '500ms'}}>
                <Grid item xs={12}>
                  <Tabs
                    variant="scrollable"
                    textColor="secondary"
                    indicatorColor="secondary"
                    value={this.state.tabValue}
                    onChange={(event, newValue) =>
                      this.setState({ tabValue: newValue })
                    }
                  // TabIndicatorProps={tabStyle.indicatorColor}
                  >
                    <Tab
                      label="Mission"
                    // style={
                    //   this.state.tabValue === 0 ? tabStyle.active : tabStyle.label
                    // }
                    />
                    <Tab
                      label="Laboratories"
                    // style={
                    //   this.state.tabValue === 1 ? tabStyle.active : tabStyle.label
                    // }
                    />
                    <Tab
                      label="Industrial Visits"
                    // style={
                    //   this.state.tabValue === 2 ? tabStyle.active : tabStyle.label
                    // }
                    />
                    <Tab
                      label="Study Tour"
                    // style={
                    //   this.state.tabValue === 3 ? tabStyle.active : tabStyle.label
                    // }
                    />
                    <Tab
                      label="Internships"
                    // style={
                    //   this.state.tabValue === 4 ? tabStyle.active : tabStyle.label
                    // }
                    />
                  </Tabs>
                </Grid>
              </Zoom>
              <Zoom in={true} style={{transitionDelay: '500ms'}}>
                <Grid item xs={12}>
                  <TabPanel value={this.state.tabValue} index={0}>
                    <AnimatedText color='secondary'>The mission of the CS & IT department is:</AnimatedText>
                    <AnimatedText color='secondary'>
                      - To educate undergraduate and graduate majors as well as the
                      broader campus community in the fundamental concepts of the
                      computing disciplines, to create and disseminate computing
                      knowledge and technology, and to use our expertise in computing
                      to help solve societal problems.
                    </AnimatedText>
                    <AnimatedText color='secondary'>
                      - Excellence in research - achieved by tackling problems of
                      real-world complexity of real-world complexity - with the
                      potential for significant long-term impact on the fields of
                      computer science and multidisciplinary computing.
                    </AnimatedText>
                    <AnimatedText color='secondary'>
                      - Excellence in education by providing the nation with computer
                      scientists having a core of knowledge allowing them to adapt to
                      a rapidly changing technology and provide industry, universities
                      and government with the next generation of leaders in the field.
                    </AnimatedText>
                    <AnimatedText color='secondary'>
                      - Excellence in working with industry, government, educators and
                      the community to advance computing and to serve the needs of
                      these organizations and groups.
                    </AnimatedText>
                  </TabPanel>
                  <TabPanel value={this.state.tabValue} index={1}>
                    <AnimatedText color='secondary'>
                      The Department has the following well-equipped laboratories with
                      latest PCs & Sun Micro Systems, equipped with the latest
                      development software and tools. These laboratories have also been
                      connected with the Digital Resources Library of the HEC to provide
                      latest resources and information to the students as well as to the
                      faculty members of the department.
                    </AnimatedText>
                  </TabPanel>
                  <TabPanel value={this.state.tabValue} index={2}>
                    <AnimatedText color='secondary'>
                      Industrial visits are arranged on regular basis. The major
                      objective of these visits is to enable the students gain first
                      hand knowledge of the application and developments in their fields
                      of specializations.
                    </AnimatedText>
                  </TabPanel>
                  <TabPanel value={this.state.tabValue} index={3}>
                    <AnimatedText color='secondary'>
                      Study tours related to the courses offered are arranged for
                      students during the semester. This helps them explore the
                      practical aspects of their subjects along side the theory taught.
                    </AnimatedText>
                  </TabPanel>
                  <TabPanel value={this.state.tabValue} index={4}>
                    <AnimatedText color='secondary'>
                      Department arranges internship during the summers for practical
                      training of the students. Internships are arranged both in
                      Government and Private sector organizations.
                    </AnimatedText>
                  </TabPanel>
                </Grid>
              </Zoom>
            </Grid>
          </Grid>
        </Grid>

        {/* <Grid
          container
          xs={12}
          md={4}
          lg={4}
          rowSpacing={0.5}
          columnSpacing={0.5}
        >
          <Grid item xs={12}>
            <Grid item xs={6} md={12} lg={6}>
              <img
                src="https://www.uetpeshawar.edu.pk/images/csit6.png"
                alt="csit_image_1"
              />
            </Grid>
            <Grid item xs={6} md={12} lg={6}>
              <img
                src="https://www.uetpeshawar.edu.pk/images/csit4.png"
                alt="csit_image_2"
              />
            </Grid>
            <Grid item xs={6} md={12} lg={6}>
              <img
                src="https://www.uetpeshawar.edu.pk/images/csit2.png"
                alt="csit_image_3"
              />
            </Grid>
            <Grid item xs={6} md={12} lg={6}>
              <img
                src="https://www.uetpeshawar.edu.pk/images/csit3.png"
                alt="csit_image_4"
              />
            </Grid>
          </Grid>
          </Grid> */}




        {/* <Grid container xs={12} md={4} lg={4}>
            <div className="App">
            <div Container
                style={{
                  border: "1px solid rgb(218, 216, 216)",
                  padding: '0 0 0 10px'
                  
                }}>News and Event</div>
              <Container
                style={{
                  border: "1px solid rgb(218, 216, 216)",
                  Width: "1000px",
                  maxHeight: "400px",
                  overflow: "scroll",
                }}
               
              >
                
                * <img src="images/new.gif"></img>
                <Row xs={12}>
                  {this.state.eventsArr.map((event) => {
                    return (
                      <div ref="messageList" style={{ backgroundColor: "rgb(218, 216, 216)" }}>
                        {/* <AnimatedText>NEW</AnimatedText>  
                        <AnimatedText Transition={Fade} delay='200ms' style={{padding:"10px",
                                            fontSize: 18,}}>
                          {event.title} ({event.body})
                        </AnimatedText>
                        
                        <div
                          style={{
                            flex: 1,
                            height: "1px",
                            backgroundColor: "#fff",
                          }}
                        />
                      </div>
                    );
                  })}
                </Row>
              </Container>
            </div>
          </Grid> */}
      </Grid>
    );
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

export default withRouter(MainHome);
