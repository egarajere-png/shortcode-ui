import React from 'react'
import RenderOnRole from './access/RenderOnRole'
import UserService from '../services/UserService'
import { Link } from "react-router-dom";

function Aside() {
  return (
    <aside aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
        <ul className="space-y-2">
          <li>
            <div className="flex items-center p-2 text-base font-normal text-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6.5 5C5.67 5 5 5.67 5 6.5S5.67 8 6.5 8 8 7.33 8 6.5 7.33 5 6.5 5M6.5 5C5.67 5 5 5.67 5 6.5S5.67 8 6.5 8 8 7.33 8 6.5 7.33 5 6.5 5M21.41 11.58L12.41 2.58C12.04 2.21 11.53 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.53 2.21 12.04 2.59 12.42L3 12.82C3.64 12.44 4.35 12.19 5.08 12.08L4 11V4H11L20 13L13 20L11.92 18.92C11.82 19.66 11.56 20.36 11.18 21L11.59 21.41C11.96 21.79 12.47 22 13 22C13.53 22 14.04 21.79 14.41 21.41L21.41 14.41C21.79 14.04 22 13.53 22 13C22 12.47 21.79 11.96 21.41 11.58M6.5 5C5.67 5 5 5.67 5 6.5S5.67 8 6.5 8 8 7.33 8 6.5 7.33 5 6.5 5M8.63 14.27L4.76 18.17L3.41 16.8L2 18.22L4.75 21L10.03 15.68L8.63 14.27" clipRule="evenodd"></path></svg>
              <span className="flex-1 ml-3 whitespace-nowrap"><b>Manage Shortcodes</b></span>
            </div>
          </li>
          <RenderOnRole roles={['checker']}>
            <li>
              <Link to="/" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" >
                <span className="flex-1 ml-3 whitespace-nowrap">Request Short Code</span>
              </Link>
            </li>
            <li>
              <Link to="/pending" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" >
                <span className="flex-1 ml-3 whitespace-nowrap">Pending Approvals</span>
              </Link>
            </li>
            <li>
              <Link to="/query" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" >
                <span className="flex-1 ml-3 whitespace-nowrap">Query Short Code</span>
              </Link>
            </li>
          </RenderOnRole>
          <li>
            <div className="flex items-center p-2 text-base font-normal text-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" clipRule="evenodd"></path></svg>
              <span className="flex-1 ml-3 whitespace-nowrap"><b>Account</b></span>
            </div>
          </li>
          <li>
            <div onClick={() => UserService.doLogout()} className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
            </div>
          </li>
          <li>
            <div onClick={() => window.open("http://172.16.2.175/otrs/index.pl?Action=AgentFAQZoom;ItemID=10", '_blank', 'noopener,noreferrer')} className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <span className="flex-1 ml-3 whitespace-nowrap">Help</span>
            </div>
          </li>
        </ul>
      </div>
    </aside >

  )
}

export default Aside