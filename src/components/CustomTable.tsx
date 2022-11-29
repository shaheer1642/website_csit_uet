
import React from 'react';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, TablePagination, Typography, Button } from '@mui/material';

const styles = {
  background: 'darkGrey',
  table: {
    "& th": {
      color: "red",
      backgroundColor: "darkBlue"
    },
    "& tr": {
      color: "red",
      backgroundColor: "darkBlue"
    }
  },
  tablePagination: {
    color: "white",
    backgroundColor: "darkBlue"
  }
}

interface column {
  id: string,
  label: string,
  format: Function,
  align: "inherit" | "left" | "center" | "right" | "justify" | undefined,
  minWidth: string
};

interface IProps {
  rows: Array<any>,
  columns: Array<column>
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
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', margin: '10px' }}>
        <TableContainer sx={{ maxHeight: 440 , backgroundColor: styles.background}}>
          <Table stickyHeader sx={styles.table}>
            <TableHead>
              <TableRow>
                {this.props.columns.map((column) => (
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
              {this.props.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                .map((event, index) => {
                  return (
                    <TableRow onClick={() => console.log('row clicked')} hover role="checkbox" tabIndex={-1} key={index}>
                      {this.props.columns.map((column) => {
                        const value = event[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format(value)}
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
          sx={styles.tablePagination}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={this.props.rows.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onPageChange={this.handleChangePage}
          onRowsPerPageChange={this.handleChangeRowsPerPage}
        />
      </Paper>
    )
  }
}