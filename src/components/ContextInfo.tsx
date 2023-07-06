// @ts-nocheck
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Color from '@mui/material/colors';
import { Card, Typography, Grid } from '@mui/material';
import { convertUpper } from '../extras/functions';

interface IProps {
  contextInfo: Object,
  overrideIncludeKeys: String[],
  omitIncludeKeys: String[],
}


export default class ContextInfo extends React.Component<IProps> {
    constructor(props) {
      super(props);

      this.includeKeys = (this.props.overrideIncludeKeys || [
        'batch_no',
        'batch_stream',
        'enrollment_season',
        'enrollment_year',
        'degree_type',
        'semester_season',
        'semester_year',
        'course_name',
        'credit_hours',
        'department',
        'course_type',
        'teacher_name',
        'student_name',
        'student_father_name',
        'department_name'
      ]).filter(k => !this.props.omitIncludeKeys?.includes(k))
    }

    render() {
        return (
            this.props.contextInfo ? 
            <Card elevation={3} sx={{padding: '20px', borderRadius: 0}}>
              <Grid container spacing={3} justifyContent={'space-evenly'}>
                {this.includeKeys.filter(k => Object.keys(this.props.contextInfo).includes(k)).map(key => {
                  return (
                    <Grid container item xs={'auto'} direction={'row'} spacing={1}>
                      <Grid item>
                      <Typography fontWeight={'bold'} variant='subtitle1'>{convertUpper(key?.toString())}:</Typography>
                      </Grid>
                      <Grid item>
                      <Typography variant='subtitle1'>{convertUpper(this.props.contextInfo[key]?.toString())}</Typography>
                      </Grid>
                    </Grid>
                  )
                })}
              </Grid>
            </Card> :<></>
        );
    }
}
