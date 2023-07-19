import React from 'react';
import { Grid, Tabs, Tab, Typography } from '@mui/material';
import CustomCard from '../../../components/CustomCard';
import LoadingIcon from '../../../components/LoadingIcon';
import InstructionsField from '../../../components/InstructionsField';
import { withRouter } from '../../../withRouter';

class MisHelp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: this.props.user?.user_type == 'admin' ? 0 : this.props.user?.user_type == 'pga' ? 1 : this.props.user?.user_type == 'student' ? 2 : this.props.user?.user_type == 'teacher' ? 3 : 2
    };
  }

  componentDidMount() {
  }

  render() {
    return (
        <CustomCard>
          <Grid container spacing={1}>
            {['admin','pga'].includes(this.props.user?.user_type) ?
                <Grid item xs={'auto'}>
                    <Tabs sx={{border: 2, borderColor: 'primary.main', borderRadius: 5}} value={this.state.tabIndex} onChange={(e, newIndex) => this.setState({tabIndex: newIndex})}>
                        <Tab label="Admin"/>
                        <Tab label="PGA" />
                        <Tab label="Student" />
                        <Tab label="Instructor" />
                    </Tabs>
                </Grid> : <></>
            }
            <Grid item xs={12}>
              <InstructionsField 
                readOnly={(this.props.user?.user_type == 'student' || this.props.user?.user_type == 'teacher') ? true : false} 
                instruction_id={2} 
                instruction_detail_key={
                  (this.props.user?.user_type == 'student' || this.props.user?.user_type == 'teacher') ? this.props.user?.user_type : 
                  this.state.tabIndex == 0 ? 'admin' : this.state.tabIndex == 1 ? 'pga' : this.state.tabIndex == 2 ? 'student' : this.state.tabIndex == 3 ? 'teacher' :this.props.user?.user_type
                } />
            </Grid>
          </Grid>
        </CustomCard>
    );
  }
}

export default withRouter(MisHelp)