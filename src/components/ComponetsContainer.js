import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ComponentWithAsideBar from './ComponentWithAsideBar'
import PendingRequests from './PendingRequests'
import QueryShortCode from './QueryShortCode'
import RequestShortCode from './RequestShortCode'

function ComponetsContainer() {
  return (
    <div>
      <Routes>
        <Route exact path="*" element={<ComponentWithAsideBar>
          <h1>THIS IS A SAMPLE ROUTE</h1>
        </ComponentWithAsideBar>} />
        <Route exact path="/" element={<ComponentWithAsideBar>
          <RequestShortCode />
        </ComponentWithAsideBar>} />
        <Route exact path="/pending" element={<ComponentWithAsideBar>
          <PendingRequests />
        </ComponentWithAsideBar>} />
        <Route exact path="/query" element={<ComponentWithAsideBar>
          <QueryShortCode />
        </ComponentWithAsideBar>} />
      </Routes>
      {/* </Switch> */}
    </div>
  )
}

export default ComponetsContainer