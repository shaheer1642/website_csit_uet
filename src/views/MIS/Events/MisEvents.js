// eslint-disable-no-unused-vars
import React from 'react';
import { Grid, Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, TablePagination, Typography, Button } from '@mui/material';
import { AccountCircle, Password, Visibility, VisibilityOff } from '@mui/icons-material';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';

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
  }
}

class MisEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsArr: [],
      page: 0,
      rowsPerPage: 10,
    };
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: +event.target.value,
      page: 0
    })
  };

  componentDidMount() {
    socket.emit('events/fetch', {}, (res) => {
      if (res.code == 200) {
        return this.setState({
          eventsArr: res.data
        })
      }
    })

    socket.addEventListener('events/listener/insert', this.eventsListenerInsert)
    socket.addEventListener('events/listener/delete', this.eventsListenerDelete)
  }

  componentWillUnmount() {
    socket.removeEventListener('events/listener/insert', this.eventsListenerInsert)
    socket.removeEventListener('events/listener/delete', this.eventsListenerDelete)
  }

  eventsListenerInsert = (res) => {
    if (res.code == 200) {
      return this.setState({
        eventsArr: [...this.state.eventsArr, res.data]
      })
    }
  }
  eventsListenerDelete = (res) => {
    if (res.code == 200) {
      return this.setState({
        eventsArr: this.state.eventsArr.filter((event) => event.event_id != res.data.event_id)
      })
    }
  }

  render() {
    const columns = [
      { id: 'title', label: 'Title' },
      { id: 'body', label: 'Body' },
      { id: 'creation_timestamp', label: 'Created At' },
      { id: 'expiry_timestamp', label: 'Expires' }
    ];
    return (
      <Grid container style={styles.container}>
        <Typography variant="h1" style={{ margin: '10px' }}>Events</Typography>
        <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: 'darkGrey', margin: '10px' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.eventsArr.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                  .map((event, index) => {
                    return (
                      <TableRow onClick={() => console.log('row clicked')} hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column) => {
                          const value = event[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={this.state.eventsArr.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onPageChange={this.handleChangePage}
            onRowsPerPageChange={this.handleChangeRowsPerPage}
          />
        </Paper>
        <Button variant="contained" color="button1" sx={{ margin: '10px' }} onClick={() => this.props.navigate('create')}>Create New</Button>
      </Grid>
    );
  }
}

export default withRouter(MisEvents);