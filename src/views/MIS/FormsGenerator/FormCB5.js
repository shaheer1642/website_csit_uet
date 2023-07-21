/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography
} from "@mui/material";
import { socket } from "../../../websocket/socket";
import { withRouter } from "../../../withRouter";
import CustomModal from "../../../components/CustomModal";
import CustomTextField from "../../../components/CustomTextField";
import LoadingIcon from "../../../components/LoadingIcon";
import CustomButton from "../../../components/CustomButton";
import { convertUpper } from "../../../extras/functions";
import { timeLocale } from "../../../objects/Time";


class FormCB5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,

      instructor_name: '',
      digital_signature: undefined,
      department: 'CS & IT',
      department_full: 'Computer Science and Information Technology (CS & IT)',
      course_no: '',
      course_title: '',
      credit_hours: '',
      total_credit_hours: '',
      semester_year: '',
      semester_season: '',
      semester_start: '',
      semester_end: '',
      dated: new Date().toLocaleDateString(...timeLocale),
      bill_amount: '',
      designation: '',
      program: '',

      formHtml: '<html><body></body></html>'
    };
    this.sem_course_id = this.props.location.state.sem_course_id
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillUnmount() {
  }

  fetchData = () => {
    this.setState({ loading: true })
    socket.emit('semestersCourses/fetch', { sem_course_id: this.sem_course_id }, (res) => {
      if (res.code == 200 && res.data.length == 1) {
        this.setState({ loading: false })
        const data = res.data[0]
        this.setState({
          instructor_name: data.teacher_name,
          digital_signature: data.digital_signature,
          course_no: data.course_id,
          course_title: data.course_name,
          credit_hours: data.credit_hours,
          semester_year: data.semester_year,
          semester_season: data.semester_season,
          semester_start: new Date(Number(data.semester_start_timestamp)).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          semester_end: new Date(Number(data.semester_end_timestamp)).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          dated: new Date().toLocaleDateString(...timeLocale),
        })
      }
    })
  }

  generateModal = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant={'h5'}>Please input the following fields</Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomTextField fullWidth label={'Total Credit Hours'} placeholder={'54 | 72'} value={this.state.total_credit_hours} onChange={(e) => this.setState({ total_credit_hours: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField fullWidth label={'Program'} placeholder={'M.Sc. | PhD'} value={this.state.program} onChange={(e) => this.setState({ program: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField fullWidth label={'Designation'} placeholder={'Professor | Associate Professor | Assistant Professor | Lecturer'} value={this.state.designation} onChange={(e) => this.setState({ designation: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField fullWidth label={'Total Bill Amount (In figure/in words)'} placeholder={'78,300/- Seventy-Eight Thousand & Three Hundred'} value={this.state.bill_amount} onChange={(e) => this.setState({ bill_amount: e.target.value })} />
        </Grid>
        <Grid item xs={'auto'}>
          <CustomButton label="Generate" variant="contained" onClick={() => this.generateForm()} />
        </Grid>
        <Grid item xs={'auto'}>
          <CustomButton label="Cancel" variant="outlined" onClick={() => this.props.onClose()} />
        </Grid>
      </Grid>
    )
  }

  htmlFunctions = {
    formatUnderlined: (str, options = { uppercase: undefined, bold: undefined }) => `${options.bold ? '<b>' : ''}<u>${'&nbsp;'.repeat(3)}${options.uppercase ? convertUpper(str) : str}${'&nbsp;'.repeat(3)}</u>${options.bold ? '</b>' : ''}`
  }

  generateForm = () => {
    const html =
      `<html>
    <style>
        .row {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .column {
            float: left;
        }
        
        /* Clear floats after the columns */
        .row:after {
            content: "";
            display: table;
            clear: both;
        }

        @media print{
            .noprint{
                display:none;
            }
            @page { margin: 0; }
            body { margin: 1.6cm; }
        }
    </style>
    <body>
        <button class="noprint" type="button" onClick="print()">Print Form</button>
        <div class="row">
            <div class="column" style="margin-right: 30px">
                <img width="50" height="50" src="https://upload.wikimedia.org/wikipedia/en/9/95/University_of_Engineering_and_Technology_Peshawar_logo.svg"/>
            </div>
            <div class="column">
                <h3>DIRECTORATE OF POSTGRADUATE STUDIES<br>UNIVERSITY OF ENGINEERING & TECHNOLOGY,<br>PESHAWAR</h3>
            </div>
        </div>
        <p align="right"><u>FORM CB-5</u></p>
        <h2 align="center"><b><u>CERTIFICATE AND BILL</u></b></h2>
        <p>
          This is to certify that I ${this.htmlFunctions.formatUnderlined(this.state.instructor_name)}
          have conducted ${this.state.program} Classes 
          in ${this.htmlFunctions.formatUnderlined(this.state.department_full)}
          in ${this.htmlFunctions.formatUnderlined(`${this.state.course_no} - ${this.state.course_title}`)}
          for	${this.htmlFunctions.formatUnderlined(this.state.total_credit_hours)}	hours for 
          the	${this.htmlFunctions.formatUnderlined(this.state.credit_hours)}	Credit Course during 
          the ${this.htmlFunctions.formatUnderlined(convertUpper(`${this.state.semester_season} ${this.state.semester_year}`))} Semester
          from ${this.htmlFunctions.formatUnderlined(this.state.semester_start)} to ${this.htmlFunctions.formatUnderlined(this.state.semester_end)}<br>
          The Result on official Form G-2B is attached herewith complete in all respects.<br>
          The Honorarium Bill for Rs. ${this.htmlFunctions.formatUnderlined(this.state.bill_amount)} for teaching the above-mentioned course for its full duration is being submitted herewith for payment.        
        </p>
        <p style="text-align:left; ${this.state.digital_signature ? 'position: relative; padding-top: 20px; padding-bottom: 20px;' : ''}">
            Dated: ${this.state.dated}
            <span style="float:right;">
                ${this.htmlFunctions.formatUnderlined('&nbsp;'.repeat(20))}
            </span>
            ${this.state.digital_signature ? `
                <img style="position: absolute; right: 50; top: 0" src='${this.state.digital_signature}' width="40px"/>
            `: ''}
        </p>
        <p align="right">
          (Please sign herein full)
        </p>
        <p align="right">
            Name: ${this.htmlFunctions.formatUnderlined(this.state.instructor_name, { bold: true })}
        </p>
        <p align="right">
            Designation: ${this.htmlFunctions.formatUnderlined(this.state.designation)}
        </p>
        <p align="right">
            Department: ${this.htmlFunctions.formatUnderlined(this.state.department)}
        </p>
          <p>
              NOTE:-<br>  
              The following rates of honorarium have been approved in 96th meeting of the Syndicate held on 21.06.2015 vide Notification No. 08/22/14/Estt-1/Vol-II dated 01.01.2016<br>  
              1. Professor (@ 2050/- per credit hour) for 54 credits = 110700/- and for 72 credits = 147600/- <br>  
              2. Associate Prof. (@ 1745/- per credit hour) for 54 credits = 94230/- and for 72 credits = 125640/- <br>  
              3. Asstt. Prof. (@ 1450/- per credit hours) for 54 credits = 78300/- and for 72 credits = 104400/- <br>  
              4. Lecturer (@ 1225/- per credit hours) for 54 credits = 66150/- and for 72 credits = 88200 
          </p>
    </body>
</html>`;
    const printWindow = window.open('', '', 'height=800,width=600');
    printWindow.document.write(html);
    this.props.onClose()
  }

  fetchForm = (endpoint) => {
    this.setState({ fetchingForm: endpoint })
    socket.emit(`forms/${endpoint}`, {
      sem_course_id: this.sem_course_id,
    }, (res) => {
      console.log(res)
      this.setState({ fetchingForm: '' })
      var printWindow = window.open('', '', 'height=800,width=600');
      printWindow.document.write(res.code == 200 ? res.data : `<html><body><p>${res.message || 'Error occured fetching form'}</p></body></html>`);
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon /> :
        <CustomModal open={this.props.open} onClose={this.props.onClose} containerStyle={{ width: 600 }}>
          {this.generateModal()}
        </CustomModal>
    );
  }
}

export default withRouter(FormCB5);
