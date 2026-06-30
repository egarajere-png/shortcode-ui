import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import UserService from "../services/UserService";

import ComponentWithAsideBar from "./ComponentWithAsideBar";
import Dashboard from "./Dashboard";
import RequestShortCode from "./RequestShortCode";
import PendingRequests from "./PendingRequests";
import QueryShortCode from "./QueryShortCode";
import QueryAccountShortCode from "./QueryAccountShortCode";
import AuditTrail from "./AuditTrail";
import DeleteShortCode from "./DeleteShortCode";
import PendingDeleteRequests from "./PendingDeleteRequests";
import TestShortCodeRequest from "./TestShortCodeRequest";
import B2C from "./mpesa/B2C";
import C2B from "./mpesa/C2B";
import RenderOnRole from "./access/RenderOnRole";
import Registry from "./Registry";



function ComponetsContainer() {
  return (
    <div>
      <Routes>
        <Route
    path="/"
    element={
        UserService.hasRole(["apicaller"])
            ? <Navigate to="/dashboard" replace />
            : UserService.hasRole(["maker"])
                ? <Navigate to="/request" replace />
                : <Navigate to="/pending" replace />
    }
/>
       <Route
    path="/dashboard"
    element={
        <ComponentWithAsideBar>
            <RenderOnRole roles={["apicaller"]}>
                <Dashboard />
            </RenderOnRole>
        </ComponentWithAsideBar>
    }
/>

<Route
    path="/registry"
    element={
        <ComponentWithAsideBar>
            <Registry />
        </ComponentWithAsideBar>
    }
/>

      <Route
    path="/registry/:status"
    element={
        <ComponentWithAsideBar>
            <Registry />
        </ComponentWithAsideBar>
    }
/>
        <Route exact path="/request" element={<ComponentWithAsideBar>
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