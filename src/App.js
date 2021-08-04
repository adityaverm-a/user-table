import React, { useEffect, useState } from 'react'
import Table from './component/Table'
import axios from 'axios'

import './App.css'

const api = axios.create({
  baseURL: `https://jsonplaceholder.typicode.com/`
})

const App = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    //To get the initial Users
    getUser()
  }, [])

  
  //@route  GET api/users
  //@desc   Getting the initial set of Users
  const getUser = async () => {
    try {
      const { data } = await api.get('/users')
      setData(data)
    } catch (err) {
      console.error(err)
    }
  }

  //@route  POST api/users
  //@desc   Adding a new User
  const handleRowAdd = async (newData, resolve) => {
    const config = {
      header : {
        'Content-type': 'application/json'
      }
    }

    try {
      const res = await api.post('/users', newData, config)

      setTimeout(() => {
        setData([...data, res.data])

        resolve()
      }, 1000)
    } catch (err) {
      console.error(err)
    }
  }

  //@route  PUT api/users/:id
  //@desc   Updating a existing User
  const handleRowUpdate = async (newData, oldData, resolve) => {
    const config = {
      header : {
        'Content-type': 'application/json'
      }
    }

    try {
      const res = await api.put(`users/${newData.id}`, newData, config)

      const index = oldData.tableData.id
      const updatedRows = [...data]
      updatedRows[index] = res.data

      setTimeout(() => {
        setData(updatedRows)

        resolve()
      }, 1000)
    } catch (err) {
      console.error(err)
    }
  }

  //@route  DELETE api/users/:id
  //@desc   Delete a existing User
  const handleRowDelete = async (oldData, resolve) => {
    try {
      await api.delete(`/users/${oldData.id}`)

      const index = oldData.tableData.id
      const updatedRows = [...data]
      updatedRows.splice(index, 1)

      setTimeout(() => {
        setData(updatedRows)

        resolve()
      }, 1000)
    } catch (err) {
      console.error(err)
    }
  }

  //@route  Patch api/users/:id
  //@desc   Updating a existing User's Info
  const handleCellEdit = async (newValue, oldValue, rowData, columnDef, resolve) => {
    const config = {
      header : {
        'Content-type': 'application/json'
      }
    }

    const index = columnDef.field
    const updatedRow = rowData
    updatedRow[index] = newValue
    try {
      await api.patch(`/users/${rowData.id}`, updatedRow, config)

      const updatedRows = [...data]
      updatedRows.map(row => row.id === rowData.id ? updatedRows : row)
      setTimeout(() => {
        setData(updatedRows)

        resolve()
      }, 1000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='container'>
      <h1>User Manager Component</h1>
      <h6>(created using Material-Table and Material UI)</h6>
      <div className='table-container'>
        <Table 
          data={data} 
          handleRowAdd={handleRowAdd}
          handleCellEdit={handleCellEdit}
          handleRowDelete={handleRowDelete}
          handleRowUpdate={handleRowUpdate}
        />
      </div>
    </div>
  )
}

export default App
