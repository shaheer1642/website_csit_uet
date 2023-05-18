// @ts-nocheck
import React from 'react';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, TablePagination, tableCellClasses, styled, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import LoadingIcon from './LoadingIcon';
import CustomButton from './CustomButton';

const defaultStyles = {
  colors: {
    headerTextColor: 'white',
    headerBackgroundColor:Color.deepPurple[500],
    rowTextColor: 'black',
    rowBackgroundColor: 'white',
    nthRowBackgroundColor: Color.deepPurple[100],
    footerTextColor: 'black',
    footerBackgroundColor: 'white',
  }
}

interface column {
  id: string,
  label: string,
  format: Function,
  align: "inherit" | "left" | "center" | "right" | "justify" | undefined,
  minWidth: string | undefined,
  component?: React.Component
};

interface IProps {
  rows: Array<any>,
  columns: Array<column>,
  onViewClick?: Function,
  viewButtonLabel?: string,
  onRowClick?: Function,
  onEditClick?: Function,
  onDeleteClick?: Function,
  headerTextColor?: string,
  headerBackgroundColor?: string,
  rowTextColor?: string,
  rowBackgroundColor?: string,
  nthRowBackgroundColor?: string,
  footerTextColor?: string,
  footerBackgroundColor?: string,
  loadingState?: boolean,
  maxWidth?: string
}

interface IState {
  page: number,
  rowsPerPage: number,
}

export default class CustomTable extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
    };
  }

  handleNVEnter = event => {
    console.log('Enter: ');
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

  render() {
    const styles = {
      background: 'darkGrey',
      tablePagination: {
        color: this.props.footerTextColor || defaultStyles.colors.footerTextColor,
        backgroundColor: this.props.footerBackgroundColor || defaultStyles.colors.footerBackgroundColor
      }
    }
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: this.props.headerBackgroundColor || defaultStyles.colors.headerBackgroundColor,
        color: this.props.headerTextColor || defaultStyles.colors.headerTextColor,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      backgroundColor: this.props.rowBackgroundColor || defaultStyles.colors.rowBackgroundColor,
      '&:nth-of-type(odd)': {
        backgroundColor: this.props.nthRowBackgroundColor || defaultStyles.colors.nthRowBackgroundColor,
      },
      // hide last border
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));

    return (
      <Paper sx={{ overflow: 'hidden', maxWidth: this.props.maxWidth, width: '100%' }}>
        {this.props.loadingState ? <LoadingIcon /> :
          <React.Fragment>
            <TableContainer sx={{ maxHeight: 440, backgroundColor: styles.background }}>
              <Table stickyHeader>
                <TableHead>
                  <StyledTableRow >
                    {this.props.columns.map((column) => (
                      <StyledTableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </StyledTableCell>
                    ))}
                    {this.props.onEditClick || this.props.onDeleteClick || this.props.onViewClick ?
                      <StyledTableCell
                        key="action_buttons"
                        align="left"
                      >
                        Actions
                      </StyledTableCell> : <></>
                    }
                  </StyledTableRow >
                </TableHead>
                <TableBody>
                  {this.props.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                    .map((row, index) => {
                      return (
                        <StyledTableRow hover role="checkbox" key={index}>
                          {this.props.columns.map((column, index) => {
                            const value = row[column.id];
                            return (
                              <StyledTableCell onClick={() => this.props.onRowClick ? this.props.onRowClick(row) : {}} key={index} align={column.align}>
                                {column.format ? column.format(value) : value}
                              </StyledTableCell>
                            );
                          })}
                          {this.props.onEditClick || this.props.onDeleteClick || this.props.onViewClick?
                            <StyledTableCell key="action_buttons">
                              {this.props.onEditClick ? 
                              <IconButton style={{ color: Color.deepPurple[500] }} onClick={() => this.props.onEditClick(row)}><Edit /></IconButton>:<></>}
                              {this.props.onDeleteClick ?
                              <IconButton style={{ color: Color.red[500] }} onClick={() => this.props.onDeleteClick(row)}><Delete /></IconButton>:<></>}
                              {this.props.onViewClick ? 
                              <CustomButton fontSize={'12px'} size='small' variant='outlined' label={this.props.viewButtonLabel} onClick={() => this.props.onViewClick(row)} />:<></>}
                            </StyledTableCell> : <></>
                          }
                        </StyledTableRow >
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              sx={styles.tablePagination}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={this.props.rows.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            />
          </React.Fragment>
        }
      </Paper>
    )
  }
}

