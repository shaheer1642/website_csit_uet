import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, Tabs, Tab, Button } from "@mui/material";
import { socket } from "../websocket/socket";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { CardImg, CardText, CardBody,  Container } from "reactstrap";

const tabStyle = {
  indicatorColor: {
    sx: {
      backgroundColor: "orange",
    },
  },
  label: {
    color: "black",
  },
  active: {
    color: "orange",
  },
};

class MainHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      eventsArr: [],
    };
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
      <Grid container spacing={1} style={{ margin: 20 }}>
        <Grid item xs={12} md={8} lg={8}>
          <Typography style={{ textAlign: "left" }} variant="h4">
            Department Of Computer Science & Information Technology Peshawar
            Campus
          </Typography>
          <Typography
            style={{ textAlign: "left" }}
            variant="body1"
            gutterBottom
          >
            The Department of Computer Science & Information Technology offers
            undergraduate and graduate courses leading to the award of Bachelor
            of Science and Master of Science in Computer Science respectively.
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
          </Typography>

          <Tabs
            variant="scrollable"
            value={this.state.tabValue}
            onChange={(event, newValue) =>
              this.setState({ tabValue: newValue })
            }
            TabIndicatorProps={tabStyle.indicatorColor}
          >
            <Tab
              label="Mission"
              style={
                this.state.tabValue === 0 ? tabStyle.active : tabStyle.label
              }
            />
            <Tab
              label="Laboratories"
              style={
                this.state.tabValue === 1 ? tabStyle.active : tabStyle.label
              }
            />
            <Tab
              label="Industrial Visits"
              style={
                this.state.tabValue === 2 ? tabStyle.active : tabStyle.label
              }
            />
            <Tab
              label="Study Tour"
              style={
                this.state.tabValue === 3 ? tabStyle.active : tabStyle.label
              }
            />
            <Tab
              label="Internships"
              style={
                this.state.tabValue === 4 ? tabStyle.active : tabStyle.label
              }
            />
          </Tabs>
          <div style={{ height: 250, overflow: "auto" }}>
            <TabPanel value={this.state.tabValue} index={0}>
              <div>The mission of the CS & IT department is:</div>
              <div>
                - To educate undergraduate and graduate majors as well as the
                broader campus community in the fundamental concepts of the
                computing disciplines, to create and disseminate computing
                knowledge and technology, and to use our expertise in computing
                to help solve societal problems.
              </div>
              <div>
                - Excellence in research - achieved by tackling problems of
                real-world complexity of real-world complexity - with the
                potential for significant long-term impact on the fields of
                computer science and multidisciplinary computing.
              </div>
              <div>
                - Excellence in education by providing the nation with computer
                scientists having a core of knowledge allowing them to adapt to
                a rapidly changing technology and provide industry, universities
                and government with the next generation of leaders in the field.
              </div>
              <div>
                - Excellence in working with industry, government, educators and
                the community to advance computing and to serve the needs of
                these organizations and groups.
              </div>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
              The Department has the following well-equipped laboratories with
              latest PCs & Sun Micro Systems, equipped with the latest
              development software and tools. These laboratories have also been
              connected with the Digital Resources Library of the HEC to provide
              latest resources and information to the students as well as to the
              faculty members of the department.
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={2}>
              Industrial visits are arranged on regular basis. The major
              objective of these visits is to enable the students gain first
              hand knowledge of the application and developments in their fields
              of specializations.
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={3}>
              Study tours related to the courses offered are arranged for
              students during the semester. This helps them explore the
              practical aspects of their subjects along side the theory taught.
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={4}>
              Department arranges internship during the summers for practical
              training of the students. Internships are arranged both in
              Government and Private sector organizations.
            </TabPanel>
          </div>
        </Grid>

        <Grid
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
        </Grid>

        <Grid item xs={12}>
          <div className="App">
            <Container>
              <Row xs={3}>
                {this.state.eventsArr.map((event) => {
                  return (
                    <Col sm={6} md={4} className='mt-3'>
                      <Card >
                        {/* <CardImg
                          top
                          width="100%"
                          src="/assets/318x180.svg"
                          alt="Card image cap"
                        /> */}
                        <CardBody>
                          <Typography style={{textAlign:"center"}}>{event.title}</Typography>
                          <CardText style={{textAlign:"center"}}>{event.body}</CardText>
                          <Card.Footer style={{cursor: "pointer",
                                              textAlign:"center"
                        }}>
                          <Button 
                            onClick={() => {
                              socket.emit(
                                "events/delete",
                                { event_id: event.event_id },
                                (res) => {}
                              );
                            }}
                          >
                            Delete
                          </Button>
                          </Card.Footer>
                        </CardBody>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Container>
          </div>
        </Grid>
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
        <Box sx={{ marginTop: 2, marginLeft: 1 }}>
          <Typography style={{ textAlign: "left", marginLeft: 0 }}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

export default MainHome;
