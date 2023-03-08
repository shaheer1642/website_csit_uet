// @ts-nocheck 
// @typescript-eslint/no-unused-vars
import React from 'react';
import { Table, TableContainer, Typography, Checkbox, TableHead, TableCell, TableRow, TableBody, Paper, TablePagination, tableCellClasses, styled, TextField, Grid, Zoom, Alert, AlertColor, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel } from '@mui/material';
import * as Color from '@mui/material/colors';
import LoadingIcon from './LoadingIcon';
import { socket } from '../websocket/socket';
import CustomTextField from './CustomTextField';
import CustomButton from './CustomButton';
import CustomSelect from './CustomSelect';
import CustomMultiAutocomplete from './CustomMultiAutocomplete';
import { abort } from 'process';
import CustomCard from './CustomCard';
import { convertUpper } from '../extras/functions';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF',
  alertWarning: '#eb8f34',
  alertSuccess: 'green'
}

const defaultStyles = {
  container: {
    backgroundColor: 'white',
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)"
    ],
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
  },
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
  }
}

interface fieldOptions {
  [name: string]: {
    /**Label name that appears on the text field */
    label: string,
    /**Position of the field in the form i.e. 2 */
    position: number | undefined,
    /**Grid xs number. Default is 12 */
    xs: number | undefined,
    /**Default value of this field*/
    defaultValue: any | undefined,
    /**Hint*/
    placeholder: any | undefined,
    /**Width in %age*/
    width: string | undefined,
    /**Whether this field is editable*/
    disabled: boolean | undefined,
    /**field type. i.e. text, radiobox, checkbox (requires additional attributes for options)*/
    fieldType: string | undefined
    /**options for chosen field type, if any*/
    fieldTypeOptions: Array<any> | undefined
    /**endpoint, if any*/
    endpoint: string | undefined
    /**endpoint data, if any*/
    endpointData: any | undefined
    /**Select-Menu items */
    selectMenuItems: Array<{ id: string, label: string }> | undefined
  };
}

interface IProps {
  formType: "create" | "update",
  endpoint: "events",
  options: fieldOptions,
  submitSuccessMessage: string,
  backgroundColor?: string
}

interface IState {
  formLoading: boolean,
  schema: Array<any>,
  formFields: Object,
  alertMsg: string,
  alertSeverity: AlertColor | undefined
}

export default class FormGenerator extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      formLoading: true,
      schema: [],
      formFields: {},
      alertMsg: '',
      alertSeverity: 'warning'
    };
  }

  componentDidMount(): void {
    socket.emit(`schema/${this.props.endpoint}`, {}, res => {
      var schema_temp: any[] = []
      for (const key in res.data.data_types) {
        const data_type = res.data.data_types[key]
        if (data_type.required.includes(`${this.props.endpoint}/${this.props.formType}`) || data_type.optional.includes(`${this.props.endpoint}/${this.props.formType}`))
          schema_temp.push({
            ...data_type,
            key: key,
            position: this.props.options[key]?.position || null,
            required: data_type.required.includes(`${this.props.endpoint}/${this.props.formType}`) ? true : false
          })
      }
      schema_temp = schema_temp.sort((a, b) => a.position - b.position)
      console.log(schema_temp)
      var formFields: Object = {}
      schema_temp.map((attribute) => {
        formFields[attribute.key] = this.props.options[attribute.key]?.defaultValue
      })
      this.setState({ formLoading: false, schema: schema_temp, formFields: formFields })
    })
  }

  componentDidUpdate(): void {
    console.log(this.state.formFields)
  }

  handleFormFieldChange = (key: string, value: string | number | []) => {
    this.setState({ formFields: { ...this.state.formFields, [key]: value } })
  }

  render(): React.ReactNode {

    var timeoutAlertRef: ReturnType<typeof setTimeout> | undefined = undefined;
    function timeoutAlert() {
      console.log('timeoutAlert called')
      clearTimeout(timeoutAlertRef)
      timeoutAlertRef = setTimeout(() => this.setState({ alertMsg: '' }), 5000)
      console.log(timeoutAlertRef)
    }

    return (
      this.state.formLoading ? <LoadingIcon /> :
        <div>
          <CustomCard style={{padding: '20px'}} cardContent={
          <Grid container rowSpacing={'20px'} columnSpacing={'20px'} style={{ backgroundColor: this.props.backgroundColor || defaultStyles.container.backgroundColor }}>
            <Grid item xs={12}>
              <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                <Alert variant="outlined" severity={this.state.alertSeverity} sx={defaultStyles.alertBox[this.state.alertSeverity as AlertColor]}>{this.state.alertMsg}</Alert>
              </Zoom>
            </Grid>
            {this.state.schema.map(attribute => {
              return (
                <Grid item xs={this.props.options[attribute.key]?.xs || "auto"}>
                  {
                    attribute.type == 'string' || attribute.type == 'uuid' || attribute.type == 'number' || attribute.type == 'array' ?
                      this.props.options[attribute.key]?.fieldType == 'radiobox' ? 
                        <FormControl required={attribute.required}>
                          <FormLabel>{this.props.options[attribute.key]?.label}</FormLabel>
                          <RadioGroup row defaultValue={this.props.options[attribute.key]?.defaultValue} onChange={(e) => this.handleFormFieldChange(attribute.key,e.target.value)}>
                            {
                              this.props.options[attribute.key]?.fieldTypeOptions.map(option => {
                                return <FormControlLabel  value={option} control={<Radio />} label={convertUpper(option)} />
                              })
                            }
                          </RadioGroup>
                        </FormControl>
                        :
                      this.props.options[attribute.key]?.fieldType == 'select' ? 
                        <CustomSelect 
                          defaultValue={this.props.options[attribute.key]?.defaultValue} 
                          endpoint={this.props.options[attribute.key]?.endpoint} 
                          endpointData={this.props.options[attribute.key]?.endpointData} 
                          menuItems={this.props.options[attribute.key]?.selectMenuItems} 
                          label={this.props.options[attribute.key]?.label}
                          onChange={(e) => this.handleFormFieldChange(attribute.key, e.target.value)}
                          required={attribute.required}
                        />:
                        <CustomTextField 
                          disabled={this.props.options[attribute.key]?.disabled}
                          type={attribute.type == 'number' ? 'number':'text'}
                          required={attribute.required}
                          placeholder={this.props.options[attribute.key]?.placeholder}
                          value={this.state.formFields[attribute.key]}
                          multiline ={attribute.multiline}
                          maxRows={attribute.multiline ? 10:1}
                          variant="filled" 
                          style={{ width: this.props.options[attribute.key]?.width || '100%' }}
                          label={this.props.options[attribute.key]?.label}
                          onChange={(e) => this.handleFormFieldChange(attribute.key,e.target.value)} />
                        : attribute.type == 'boolean' ?
                        <FormControlLabel control={<Checkbox defaultChecked={this.props.options[attribute.key]?.defaultValue} onChange={(e) => this.handleFormFieldChange(attribute.key,e.target.checked)} />} label={this.props.options[attribute.key]?.label} />
                        : attribute.type == 'unix_timestamp_milliseconds' ?
                        <TextField
                          label={this.props.options[attribute.key]?.label}
                          type="date"
                          defaultValue={new Date(Number(this.props.options[attribute.key]?.defaultValue) || null).toISOString().split('T')[0]}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => this.handleFormFieldChange(attribute.key,new Date(e.target.value).getTime())}
                        />
                        : <Typography>Could not determine attribute type for {attribute.key}</Typography>
                  }
                </Grid>
              )
            })}
            <Grid item xs={12}>
              <CustomButton 
                label={this.props.formType == 'create' ? 'Create' : 'Update'}
                onClick={() => {
                  socket.emit(`${this.props.endpoint}/${this.props.formType}`, this.state.formFields, res => {
                    console.log(`[${this.props.endpoint}/${this.props.formType}] response`,res)
                    this.setState({
                      alertMsg: res.code == 200 ? this.props.submitSuccessMessage:`${res.status}: ${res.message}`,
                      alertSeverity: res.code == 200 ? 'success':'warning'
                    }, timeoutAlert)
                    if (res.code == 200) {
                      this.setState({
                        alertMsg:  this.props.submitSuccessMessage,
                        alertSeverity: 'success'
                      }, timeoutAlert)
                    }
                })
                }}
              />
            </Grid>
          </Grid>} />

        </div>
    )
  }
}

