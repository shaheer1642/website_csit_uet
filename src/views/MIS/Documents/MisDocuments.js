/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup, Zoom, Alert, CircularProgress } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import * as Color from "@mui/material/colors";
import { socket } from "../../../websocket/socket";
import { withRouter } from "../../../withRouter";
import CustomTable from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import CustomCard from "../../../components/CustomCard";
import { MakeDELETECall, MakeGETCall, MakePOSTCall } from "../../../api";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

const defaultStyles = {
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
  },
}

class MisDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingDocuments: true,
      documentsArr: [],
      uploadingDocuments: false,

      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },

      alertMsg: '',
      alertSeverity: 'warning'
    };
    this.timeoutAlertRef = null;
  }

  componentDidMount() {
    this.fetchDocuments()
    socket.addEventListener("documents/listener/changed", this.fetchDocuments);
  }

  componentWillUnmount() {
    socket.removeEventListener("documents/listener/changed", this.fetchDocuments);
  }

  fetchDocuments = () => {
    MakeGETCall('/api/documents')
      .then(res => {
        return this.setState({
          documentsArr: res,
          loadingDocuments: false,
        });
      }).catch(console.error)
  }

  uploadDocuments = async (e) => {
    this.setState({ uploadingDocuments: true })
    console.log('file changed', e.target.files)
    e.preventDefault()
    const promises = []
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const rawBase64 = e.target.result;
        promises.push(
          new Promise((resolve, reject) => {
            console.log('uploading file', rawBase64);
            MakePOSTCall('/api/documents', { body: { document: rawBase64, document_name: file.name } })
              .then(res => {
                resolve(`✔️ Uploaded file ${file.name}`)
              }).catch(err => {
                resolve(`❌ Error uploading file ${file.name}: ${err.message || err}`)
              })
          })
        )
      };
    })
    Promise.all(promises).then(responses => {
      this.setState({
        alertMsg: responses.join('\n'),
        alertSeverity: 'success',
        uploadingDocuments: false
      }, this.timeoutAlert)
    }).catch(console.error)
    e.target.value = null
  }

  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },
    });
  };

  timeoutAlert = () => {
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({ alertMsg: '' }), 10000)
  }

  render() {
    const columns = [
      { id: "document_name", label: "File Name", format: (value) => value },
      { id: "document_url", label: "URL", format: (value) => <a href={value} className="active">{value}</a> },
      { id: 'document_creation_timestamp', label: 'Created at', format: (value) => new Date(Number(value)).toLocaleString() }
    ];
    return (
      <CustomCard>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2">
              {`Documents`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTable
              loadingState={this.state.loadingDocuments}
              onDeleteClick={(document) => {
                this.setState({
                  confirmationModalShow: true,
                  confirmationModalMessage:
                    "Are you sure you want to remove this document?",
                  confirmationModalExecute: () => MakeDELETECall('/api/documents/' + document.document_id).catch(console.error)
                });
              }}
              rows={this.state.documentsArr}
              columns={columns}
            />
          </Grid>
          <Grid item xs={12}>
            <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
              <Alert variant="outlined" severity='info' sx={defaultStyles.alertBox[this.state.alertSeverity]}><pre>{this.state.alertMsg}</pre></Alert>
            </Zoom>
          </Grid>
          <Grid item xs={12}>
            <CustomButton
              variant='contained'
              component="label"
              disabled={this.state.uploadingDocuments}
              label={
                this.state.uploadingDocuments ? <CircularProgress size='20px' /> :
                  <React.Fragment>
                    Upload Documents
                    <input multiple hidden type="file" onChange={this.uploadDocuments} />
                  </React.Fragment>
              }
              startIcon={<UploadFile />}
            />
          </Grid>
          <ConfirmationModal
            open={this.state.confirmationModalShow}
            message={this.state.confirmationModalMessage}
            onClose={() => this.confirmationModalDestroy()}
            onClickNo={() => this.confirmationModalDestroy()}
            onClickYes={() => {
              this.state.confirmationModalExecute();
              this.confirmationModalDestroy();
            }}
          />
        </Grid>
      </CustomCard>
    );
  }
}

export default withRouter(MisDocuments);
