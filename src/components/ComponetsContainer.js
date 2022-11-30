import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ComponentWithAsideBar from './ComponentWithAsideBar'

function ComponetsContainer() {
  return (
    <div>
      <Routes>
        <Route exact path="*" element={<ComponentWithAsideBar>
          <h1>THIS IS A SAMPLE ROUTE</h1>
        </ComponentWithAsideBar>} />
      </Routes>
      {/* </Switch> */}
    </div>
  )
}

export default ComponetsContainer