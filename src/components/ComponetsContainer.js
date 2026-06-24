import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ComponentWithAsideBar from './ComponentWithAsideBar'
import PendingRequests from './PendingRequests'
import QueryAccountShortCode from './QueryAccountShortCode'
import QueryShortCode from './QueryShortCode'
import RequestShortCode from './RequestShortCode'
import AuditTrail from './AuditTrail';
import DeleteShortCode from "./DeleteShortCode";
import PendingDeleteRequests from "./PendingDeleteRequests";
import TestShortCodeRequest from "./TestShortCodeRequest";
import B2C from './mpesa/B2C'
import C2B from './mpesa/C2B'

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
        <Route path="/audit/:shortCode" element={<ComponentWithAsideBar>
         <AuditTrail />
        </ComponentWithAsideBar> }/>
        <Route exact path="/query" element={<ComponentWithAsideBar>
          <QueryShortCode />
        </ComponentWithAsideBar>} />
        <Route exact path="/query/account" element={<ComponentWithAsideBar>
          <QueryAccountShortCode />
        </ComponentWithAsideBar>} />
        <Route path="/delete" element={<ComponentWithAsideBar>
            <DeleteShortCode />
        </ComponentWithAsideBar>} />
        <Route path="/pending-delete" element={ <ComponentWithAsideBar>
            <PendingDeleteRequests />
        </ComponentWithAsideBar>} />
        <Route path="/test-request" element={ <ComponentWithAsideBar>
          <TestShortCodeRequest />
        </ComponentWithAsideBar>} />
        <Route exact path="/c2b" element={<ComponentWithAsideBar>
          <C2B />
        </ComponentWithAsideBar>} />
        <Route exact path="b2c" element={<ComponentWithAsideBar>
          <B2C />
        </ComponentWithAsideBar>} />
      </Routes>
      {/* </Switch> */}
    </div>
  )
}

export default ComponetsContainer