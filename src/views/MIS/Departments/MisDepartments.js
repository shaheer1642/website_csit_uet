/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Grid, Typography, IconButton, ButtonGroup } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import * as Color from "@mui/material/colors";
import { socket } from "../../../websocket/socket";
import { withRouter } from "../../../withRouter";
import CustomTable from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import CustomCard from "../../../components/CustomCard";
import { convertUpper } from "../../../extras/functions";
import { getUserNameById } from "../../../objects/Users_List";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

const styles = {
  container: {
    backgroundColor: palletes.primary,
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)",
    ],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
};

class MisDepartments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      departmentsArr: [],
    };
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillUnmount() {
  }

  fetchData = () => {
    this.setState({ loading: true })
    socket.emit("departments/fetch", {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          departmentsArr: res.data,
          loading: false,
        });
      }
    });
  }

  render() {
    const columns = [
      { id: "department_id", label: "Department ID", format: (value) => value },
      { id: "department_name", label: "Department Name", format: (value) => value },
      { id: "chairman_id", label: "Chairman", format: (value) => getUserNameById(value) },
    ];
    return (
      <CustomCard>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2"> Departments </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTable
              loadingState={this.state.loading}
              onEditClick={(department) =>
                this.props.navigate("update", {
                  state: { department_id: department.department_id, context_info: department },
                })
              }
              rows={this.state.departmentsArr}
              columns={columns}
            />
          </Grid>
        </Grid>
      </CustomCard>
    );
  }
}

export default withRouter(MisDepartments);
