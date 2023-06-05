import React from 'react';
import { Grid, Tabs, Tab, Typography } from '@mui/material';
import CustomCard from '../../../components/CustomCard';
import { user } from '../../../objects/User';
import LoadingIcon from '../../../components/LoadingIcon';
import InstructionsField from '../../../components/InstructionsField';

export default class MisHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: user?.user_type == 'admin' ? 0 : user?.user_type == 'pga' ? 1 : user?.user_type == 'student' ? 2 : user?.user_type == 'teacher' ? 3 : 2
    };
  }

  componentDidMount() {
  }

  render() {
    return (
        <CustomCard>
          <Grid container spacing={1}>
            {['admin','pga'].includes(user?.user_type) ?
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
                readOnly={(user?.user_type == 'student' || user?.user_type == 'teacher') ? true : false} 
                instruction_id={2} 
                instruction_detail_key={
                  (user?.user_type == 'student' || user?.user_type == 'teacher') ? user?.user_type : 
                  this.state.tabIndex == 0 ? 'admin' : this.state.tabIndex == 1 ? 'pga' : this.state.tabIndex == 2 ? 'student' : this.state.tabIndex == 3 ? 'teacher' :user?.user_type
                } />
            </Grid>
          </Grid>
        </CustomCard>
    );
  }
}