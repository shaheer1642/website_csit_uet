/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Grid, Typography, InputAdornment, InputLabel, FormControl, IconButton, Button, Link, FilledInput, Box, TextField, Autocomplete, Chip, CircularProgress, Icon, Tooltip } from '@mui/material';
import { AccountCircle, ArrowUpward, Edit, Info, Password, Upload, Visibility, VisibilityOff } from '@mui/icons-material';
import { socket } from '../../../websocket/socket';
import * as Color from "@mui/material/colors";
import CustomCard from '../../../components/CustomCard';
import LoadingIcon from '../../../components/LoadingIcon';
import CustomTextField from '../../../components/CustomTextField';
import CustomModal from '../../../components/CustomModal';
import CustomButton from '../../../components/CustomButton';
import CustomAlert from '../../../components/CustomAlert';
import { convertUpper, filterObjectByKeys } from '../../../extras/functions';
import './MisProfile.css';
import "font-awesome/css/font-awesome.css";
import { withRouter } from '../../../withRouter';
import { MakeGETCall, MakePATCHCall, MakePOSTCall } from '../../../api';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF'
}

const styles = {
  container: {
    backgroundColor: palletes.primary,
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)"
    ],
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
  },
}

class MisProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      callingApi: 'fetchUser',

      userInput: {},

      modalPanel: '',

      alertMsg: '',
      alertSeverity: 'info',

      resendCodeTimer: 0,

      updatedKeys: [],

      areasOfInterest: []
    };
    this.avatarInputRef = React.createRef(null)
  }

  componentDidMount() {
    this.fetchUser()
    this.autocompleteAreasOfInterest()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({ alertMsg: '' })
    }, 3000);
  }

  autocompleteAreasOfInterest = () => {
    MakeGETCall('/api/autocomplete/areasOfInterest').then(res => {
      this.setState({ areasOfInterest: res })
    }).catch(console.error)
    // socket.emit('autocomplete/areasOfInterest', {}, (res) => {
    //   if (res.code == 200) this.setState({ areasOfInterest: res.data })
    // })
  }

  fetchUser = () => {
    this.setCallingApi('fetchUser')
    console.log('MisProfile.fetchUser', this.props.user)
    if (!this.props.user?.user_id) return
    MakeGETCall('/api/user').then(res => {
      this.setState({
        userInfo: res,
      }, () => this.setCallingApi(''))
    }).catch(console.error)
    // socket.emit('users/fetch', { fetch_user_id: this.props.user.user_id }, (res) => {
    //   if (res.code == 200) {
    //     this.setState({
    //       userInfo: res.data[0],
    //     }, () => this.setCallingApi(''))
    //   }
    // })
  }

  setCallingApi = (value) => this.setState({ callingApi: value })

  setModalPanel = (value) => this.setState({ modalPanel: value })

  setUserInput = (key, value) => this.setState(state => ({ userInput: { ...state.userInput, [key]: value } }))

  setUserInfo = (key, value) => {
    this.setState(state => ({
      userInfo: { ...state.userInfo, [key]: value },
      updatedKeys: state.updatedKeys.includes(key) ? state.updatedKeys : [...state.updatedKeys, key]
    }))
  }

  updateAlertMesg = (msg, severity) => {
    // if (res.code == 200 && !successMessage) return
    this.setState({
      alertMsg: msg,
      alertSeverity: severity
    })
  }

  resendCodeTimer = (timeout) => {
    if (timeout) {
      clearTimeout(this.resendCodeTimerRef)
      this.setState({ resendCodeTimer: timeout }, () => this.resendCodeTimer())
    } else {
      this.resendCodeTimerRef = setTimeout(() => {
        this.setState(state => ({ resendCodeTimer: state.resendCodeTimer - 1 }), () => this.state.resendCodeTimer > 0 ? this.resendCodeTimer() : null)
      }, 1000);
    }
  }

  sendEmailVerificationCode = (callback) => {
    if (!this.state.userInput['new_email']) return this.setState({ alertMsg: 'Fields cannot be empty', alertSeverity: 'warning' })
    this.setCallingApi('sendEmailVerificationCode')
    MakePOSTCall('/api/user/sendEmailVerificationCode', {
      body: {
        user_id: this.props.user.user_id,
        user_email: this.state.userInput['new_email']
      }
    }).then(res => {
      this.updateAlertMesg('code sent', 'success')
      callback && callback(res)
    }).catch(err => {
      this.updateAlertMesg(err.message, 'warning')
    }).finally(() => {
      this.setCallingApi('')
      this.resendCodeTimer(15)
    })
    // socket.emit('users/sendEmailVerificationCode', { user_email: this.state.userInput['new_email'], user_id: this.props.user.user_id }, (res) => {
    //   this.setCallingApi('')
    //   if (res.code == 200 && callback) callback(res)
    //   this.updateAlertMesg(res)
    //   this.resendCodeTimer(15)
    // })
  }

  updateEmail = (callback) => {
    if (!this.state.userInput['new_email'] || !this.state.userInput['email_verification_code'])
      return this.setState({ alertMsg: 'Fields cannot be empty', alertSeverity: 'warning' })

    this.setCallingApi('updateEmail')
    MakePATCHCall('/api/user/updateEmail', {
      body: {
        user_email: this.state.userInput['new_email'],
        email_verification_code: this.state.userInput['email_verification_code']
      }
    }).then(res => {
      this.updateAlertMesg(res.message, 'success')
    }).catch(err => {
      this.updateAlertMesg(err.message, 'warning')
    }).finally(() => {
      this.setCallingApi('')
    })
    // socket.emit('users/updateEmail', {
    //   user_email: this.state.userInput['new_email'],
    //   email_verification_code: this.state.userInput['email_verification_code']
    // }, (res) => {
    //   this.setCallingApi('')
    //   if (res.code == 200 && callback) callback(res)
    //   this.updateAlertMesg(res)
    // })
  }

  changePassword = (callback) => {
    if (!this.state.userInput['current_password'] || !this.state.userInput['new_password'] || !this.state.userInput['confirm_new_password']) return this.setState({ alertMsg: 'Fields cannot be empty', alertSeverity: 'warning' })
    this.setCallingApi('changePassword')
    MakePATCHCall('/api/user/changePassword', {
      body: {
        current_password: this.state.userInput['current_password'],
        new_password: this.state.userInput['new_password']
      }
    }).then(res => {
      this.updateAlertMesg(res.message, 'success')
      callback && callback(res)
    }).catch(err => {
      this.updateAlertMesg(err.message, 'warning')
    }).finally(() => {
      this.setCallingApi('')
    })
    // socket.emit('users/changePassword', { current_password: this.state.userInput['current_password'], new_password: this.state.userInput['new_password'] }, res => {
    //   this.setCallingApi('')
    //   if (res.code == 200 && callback) callback(res)
    //   this.updateAlertMesg(res)
    // })
  }

  closeModal = () => {
    this.setModalPanel('')
    this.fetchUser()
    this.setUserInput('new_email', '')
    this.setUserInput('confirm_new_email', '')
    this.setUserInput('email_verification_code', '')
    this.setUserInput('current_password', '')
    this.setUserInput('new_password', '')
    this.setUserInput('confirm_new_password', '')
  }

  handleChangeSignature = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const rawBase64 = e.target.result;
      this.setUserInfo('digital_signature', rawBase64)
    };
  }

  modalPanels = {
    updateEmailPanel1: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Update Email</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Enter New Email' value={this.state.userInput['new_email'] || ''} onChange={(e) => this.setUserInput('new_email', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Confirm New Email' value={this.state.userInput['confirm_new_email'] || ''} onChange={(e) => this.setUserInput('confirm_new_email', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <CustomButton label='Next' callingApiState={this.state.callingApi == 'sendEmailVerificationCode'} onClick={() => {
              if (this.state.userInput['new_email'] != this.state.userInput['confirm_new_email']) return this.setState({ alertMsg: 'Emails mismatch', alertSeverity: 'warning' })
              this.sendEmailVerificationCode(() => this.setModalPanel('updateEmailPanel2'))
            }} />
          </Grid>
        </Grid>
      )
    },
    updateEmailPanel2: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Update Email</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>Enter the verification code sent at the email address {this.state.userInput['new_email']}</Typography>
            <Typography>Make sure to check the spam folder</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Verification code' value={this.state.userInput['email_verification_code'] || ''} onChange={(e) => this.setUserInput('email_verification_code', e.target.value)} />
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={'auto'}>
            <CustomButton label='Submit' callingApiState={this.state.callingApi == 'updateEmail'} onClick={() => this.updateEmail(() => this.setModalPanel('updateEmailPanel3'))} />
          </Grid>
          <Grid item xs={'auto'}>
            <CustomButton disabled={this.state.resendCodeTimer > 0} label={this.state.resendCodeTimer > 0 ? `Resend Code (${this.state.resendCodeTimer})` : 'Resend Code'} callingApiState={this.state.callingApi == 'sendEmailVerificationCode'} variant='outlined' onClick={() => this.sendEmailVerificationCode((res) => this.updateAlertMesg(res, 'Code Sent'))} />
          </Grid>
        </Grid>
      )
    },
    updateEmailPanel3: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Update Email</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h4'>Your email has been updated to {this.state.userInput['new_email']}!</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomButton label='OK' onClick={() => this.closeModal()} />
          </Grid>
        </Grid>
      )
    },
    changePasswordPanel1: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Update Password</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Enter Current Password' type='password' value={this.state.userInput['current_password'] || ''} onChange={(e) => this.setUserInput('current_password', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Enter New Password' type='password' value={this.state.userInput['new_password'] || ''} onChange={(e) => this.setUserInput('new_password', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Confirm New Password' type='password' value={this.state.userInput['confirm_new_password'] || ''} onChange={(e) => this.setUserInput('confirm_new_password', e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <CustomButton label='Next' callingApiState={this.state.callingApi == 'changePassword'} onClick={() => {
              if (this.state.userInput['new_password'] != this.state.userInput['confirm_new_password']) return this.setState({ alertMsg: 'Passwords mismatch', alertSeverity: 'warning' })
              this.changePassword(() => this.setModalPanel('changePasswordPanel2'))
            }} />
          </Grid>
        </Grid>
      )
    },
    changePasswordPanel2: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Update Password</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h4'>Your password has been updated!</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomButton label='OK' onClick={() => this.closeModal()} />
          </Grid>
        </Grid>
      )
    },
  }

  teacherFields = () => {
    return (
      <React.Fragment>
        <Grid item container xs={6} spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Areas of Interest</Typography>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              loading={this.state.areasOfInterest.length == 0}
              multiple
              options={this.state.areasOfInterest}
              value={this.state.userInfo.areas_of_interest || []}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label=""
                  placeholder="Search or add new"
                  color='primary'
                />
              )}
              onChange={(e, values) => this.setUserInfo('areas_of_interest', values.map(value => convertUpper(value)))}
            />
          </Grid>
        </Grid>
        <Grid item container xs={6} rowSpacing={2}>
          <Grid item xs={'auto'}>
            <Typography variant='h4'>Digital Signature</Typography>
          </Grid>
          <Grid item xs={'auto'}>
            <Tooltip title="Make sure your signature does not have extra empty spaces around it. The size of your signature on forms will appear the same as shown here">
              <IconButton size='small'>
                <Info />
              </IconButton>
            </Tooltip>
          </Grid>
          {this.state.userInfo.digital_signature ?
            <Grid item xs={12}>
              <img src={this.state.userInfo.digital_signature ? typeof this.state.userInfo.digital_signature == 'object' ? URL.createObjectURL(this.state.userInfo.digital_signature) : this.state.userInfo.digital_signature : ''} alt="image" width={'40px'} />
            </Grid> : <></>
          }
          <Grid item xs={12}>
            <input accept="image/*" type='file' id="imgInp" onChange={this.handleChangeSignature} />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }

  updateAvatar = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const rawBase64 = e.target.result;
      this.setCallingApi('updateAvatar')
      MakePATCHCall('/api/user/updateAvatar', { body: { avatar: rawBase64 } }).then(res => {
        this.updateAlertMesg('Avatar updated', 'success')
        this.fetchUser()
      }).catch(console.error).finally(() => this.setCallingApi(''))
    };
    // this.setCallingApi('updateAvatar')
    // socket.emit(
    //   'users/updateAvatar',
    //   { avatar: file },
    //   (res) => {
    //     this.setCallingApi('')
    //     this.updateAlertMesg(res, 'Avatar updated!')
    //     this.fetchUser()
    //   }
    // )
  }

  saveChanges = () => {
    this.setCallingApi('saveChanges')

    if (this.state.userInfo.user_type == 'teacher') {
      MakePOSTCall(`/api/teachers/${this.state.userInfo.user_id}`,
        { body: filterObjectByKeys(this.state.userInfo, this.state.updatedKeys) })
        .then(res => {
          this.updateAlertMesg('Saved changes!', 'success')
        }).catch(err => {
          this.updateAlertMesg(err.message || JSON.stringify(err), 'warning')
        }).finally(() => {
          this.setCallingApi('')
          this.setState({ updatedKeys: [] })
          this.fetchUser()
          this.autocompleteAreasOfInterest()
          this.setCallingApi('')
        })
    } else {
      this.updateAlertMesg('Not allowed to change settings for this user type', 'warning')
    }

    // socket.emit(
    //   this.state.userInfo.user_type == 'teacher' ? 'teachers/update' : '',
    //   {
    //     ...filterObjectByKeys(this.state.userInfo, this.state.updatedKeys),
    //     teacher_id: this.state.userInfo.user_id
    //   },
    //   (res) => {
    //     this.setCallingApi('')
    //     this.updateAlertMesg(res, 'Saved changes!')
    //     this.setState({ updatedKeys: [] })
    //     this.fetchUser()
    //     this.autocompleteAreasOfInterest()
    //   }
    // )
  }

  resetChanges = () => {
    this.setState({ updatedKeys: [] })
    this.fetchUser()
  }

  render() {
    return (
      this.state.callingApi == 'fetchUser' ? <LoadingIcon /> :
        <CustomCard>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h2'>My Profile</Typography>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent={'center'} alignItems={'center'} flexDirection={'column'} spacing={2}>
              {this.state.callingApi == 'updateAvatar' ? <CircularProgress /> :
                <React.Fragment>
                  <div className="avatar-wrapper">
                    <img className="profile-pic" src={this.state.userInfo.avatar} alt="Avatar" style={{ objectFit: 'cover' }} />
                    <div className="upload-button" onClick={() => this.avatarInputRef.current.click()} style={{ alignItems: 'center' }}>
                      <i className="fa fa-arrow-circle-up" aria-hidden="true"></i>
                    </div>
                    <input ref={this.avatarInputRef} className="file-upload" type="file" accept="image/*" onChange={this.updateAvatar} />
                  </div>
                </React.Fragment>
              }
            </Grid>
            <Grid item xs={'auto'}>
              <CustomTextField readOnly disabled variant='filled' label='Name' value={this.state.userInfo.name} />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomTextField readOnly disabled variant='filled' label='Email' value={this.state.userInfo.user_email || 'Not found'} />
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={'auto'}>
              <CustomButton label='Update Email' onClick={() => this.setModalPanel('updateEmailPanel1')} />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton label='Change Password' onClick={() => this.setModalPanel('changePasswordPanel1')} />
            </Grid>
            <Grid item xs={12}></Grid>
            {this.state.userInfo.user_type == 'teacher' ? this.teacherFields() : <></>}
            <Grid item xs={12}>
              <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton disabled={this.state.updatedKeys.length == 0} label='Save changes' onClick={this.saveChanges} callingApiState={this.state.callingApi == 'saveChanges'} />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton label='Reset' variant='outlined' onClick={this.resetChanges} />
            </Grid>
          </Grid>
          <CustomModal open={this.state.modalPanel != ''} onClose={() => this.closeModal()}>
            <Grid item xs={12}>
              <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
            </Grid>
            {this.modalPanels[this.state.modalPanel] ? this.modalPanels[this.state.modalPanel]() : <></>}
          </CustomModal>
        </CustomCard>
    );
  }
}

export default withRouter(MisProfile)