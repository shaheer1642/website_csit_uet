// @ts-nocheck
import React from 'react';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, TablePagination, tableCellClasses, styled  } from '@mui/material';
import * as Color from '@mui/material/colors';
import LoadingIcon from './LoadingIcon';

const defaultStyles = {
  colors: {
    headerTextColor: 'white',
    headerBackgroundColor: Color.orange[500],
    rowTextColor: 'black',
    rowBackgroundColor: 'white',
    nthRowBackgroundColor: Color.orange[200],
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
};

interface IProps {
  rows: Array<any>,
  columns: Array<column>,
  onRowClick?: Function,
  headerTextColor?: string,
  headerBackgroundColor?: string,
  rowTextColor?: string,
  rowBackgroundColor?: string,
  nthRowBackgroundColor?: string,
  footerTextColor?: string,
  footerBackgroundColor?: string,
  loadingState?: boolean
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
      <Paper sx={{ width: '100%', overflow: 'hidden', margin: '10px' }}>
        {this.props.loadingState ? <LoadingIcon color={Color.orange[500]} /> :
        <React.Fragment>
          <TableContainer sx={{ maxHeight: 440 , backgroundColor: styles.background}}>
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
                </StyledTableRow >
              </TableHead>
              <TableBody>
                {this.props.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                  .map((event, index) => {
                    return (
                      <StyledTableRow  hover onClick={() => this.props.onRowClick ? this.props.onRowClick(event):{}} role="checkbox" tabIndex={-1} key={index}>
                        {this.props.columns.map((column) => {
                          const value = event[column.id];
                          return (
                            <StyledTableCell key={column.id} align={column.align}>
                              {column.format(value)}
                            </StyledTableCell>
                          );
                        })}
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

