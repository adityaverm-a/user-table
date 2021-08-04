import React, { useState } from 'react'
import MaterialTable from 'material-table'
import { createTheme, FormControlLabel, MuiThemeProvider, Switch } from '@material-ui/core'

// const data = [
  // {
  //   name: 'Bruce Wayne',
  //   username: 'Vigilante',
  //   email: 'bruce@wayne.com',
  //   phone: '9999989897',
  //   website: 'wayne.com'
  // }
// ]

function validateEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

const Table = ({ data, handleCellEdit, handleRowAdd, handleRowDelete, handleRowUpdate }) => {
    const columns = [
        {
          title: 'Name', 
          field: 'name',
          validate: rowData => rowData.name === undefined || rowData.name === "" ? "Required" : true
        },
        {
          title: 'Username', 
          field: 'username',
          validate: rowData => rowData.username === undefined || rowData.username === "" ? "Required" : true
        },
        {
          title: 'Email', 
          field: 'email',
          validate: rowData => rowData.email === undefined || rowData.email === "" || validateEmail(rowData.email) === false ? "Enter a valid email" : true
        },
        {
          title: 'Phone', 
          field: 'phone',
          validate: rowData => rowData.phone === undefined || rowData.phone === "" ? "Required" : true
        },
        {
          title: 'Website', 
          field: 'website',
          validate: rowData => rowData.website === undefined || rowData.website === "" ? "Required" : true
        }
    ]

    const [darkMode, setDarkMode] = useState(() => {
        const mode = localStorage.getItem('_tableDarkMode')
        return mode === "true" || false
    })

    const theme = createTheme({
        palette: {
          type: darkMode ? 'dark' : 'light'
        }
      })

    const handleDarkModeChange = () => {
        setDarkMode(!darkMode)
        localStorage.setItem('_tableDarkMode', !darkMode)
    }

    return (
        <div>
            <FormControlLabel
                value="start"
                control={<Switch color="primary" checked={darkMode} />}
                onChange={handleDarkModeChange}
                label="Dark Mode"
                labelPlacement="start"
            />
            <MuiThemeProvider theme={theme}>
                <MaterialTable 
                    title={`Manage your User's Info`}
                    columns={columns}
                    data={data}
                    options={{ 
                      actionsColumnIndex: -1,
                      addRowPosition: "first",
                      exportButton: true
                    }}
                    editable={{
                        onRowAdd: (newData) => new Promise((resolve, reject) => {
                        handleRowAdd(newData, resolve)
                        }),

                        onRowDelete: (oldData) => new Promise((resolve, reject) => {
                            handleRowDelete(oldData, resolve)
                        }),

                        onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
                        handleRowUpdate(newData, oldData, resolve)
                        })
                    }}
                    cellEditable={{
                        onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                          return new Promise((resolve, reject) => {
                            handleCellEdit(newValue, oldValue, rowData, columnDef, resolve)
                            // console.log(columnDef);
                            // setTimeout(resolve, 1000);

                          })
                        }
                      }}
                />
            </MuiThemeProvider>
        </div>
    )
}

export default Table
