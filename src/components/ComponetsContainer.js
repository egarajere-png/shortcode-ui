import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ComponentWithAsideBar from './ComponentWithAsideBar'
import PendingRequests from './PendingRequests'
import QueryAccountShortCode from './QueryAccountShortCode'
import QueryShortCode from './QueryShortCode'
import RequestShortCode from './RequestShortCode'

function ComponetsContainer() {
  return (
    <div>
      <Routes>
        <Route exact path="*" element={<ComponentWithAsideBar>
          <RequestShortCode />
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
        <Route exact path="/query/account" element={<ComponentWithAsideBar>
          <QueryAccountShortCode />
        </ComponentWithAsideBar>} />
      </Routes>
      {/* </Switch> */}
    </div>
  )
}

export default ComponetsContainer