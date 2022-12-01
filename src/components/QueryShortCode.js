import React, { useState } from 'react'
import Loading from './loading/Loading';
import HttpService from '../services/HttpService';

import URLConstants from '../urlsConfig';

function QueryShortCode() {
  const authedAxios = HttpService.getAxiosClient();


  const [loading, setLoading] = useState(false);
  const [loadingMessage,] = useState("Submiting request")
  const [accountLookupResponse, setAccountLookupResponse] = useState({
    "accountNumber": "",
    "accountName": "",
    "custId": "",
    "idNumber": "",
    "phoneNumber": "",
    "emailAddress": "",
    "accountStatus": ""
  })

  //handle account look up
  const handleShortCodeLookUp = (e) => {
    e.preventDefault();
    setLoading(true)
    authedAxios.get(`${URLConstants.baseAPIURL}/${URLConstants.getShortCodeAccountDetailsURL(e.target.account.value)}`, { timeout: 10000 })
      .then(function (response) {
        console.log(response.data)
        setLoading(false);
        const data = response.data;
        if (data?.id) {
          setAccountLookupResponse(data);
        } else {
          alert("Could not get short code details")
          setAccountLookupResponse({});
        }
      })
      .catch(function (error) {
        console.log(error)
        setLoading(false)
        setAccountLookupResponse({})
        if (error.code === 'ECONNABORTED') {
          alert("Query took longer than expected. Try again");
          return
        }
        alert("Could not get short code details")
      });
  }

  return (
    <React.Fragment>
      <div className='mb-6'>
        <form className='w-96' onSubmit={handleShortCodeLookUp}>
          <div className="my-2">
            <label for="account" className="block mb-2 text-sm font-medium text-gray-900">Enter Short Code</label>
            <input type="text" id="account" name='account' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Query Short Code</button>
        </form>
      </div>
      {loading && <Loading message={loadingMessage} />}
      {accountLookupResponse?.shortCode && <LookupComponent account={accountLookupResponse} />}
    </React.Fragment>
  )
}


export default QueryShortCode


const LookupComponent = ({ account }) => {
  const downloadShortCode = () => {
    window.open(`${URLConstants.baseURL}/${URLConstants.getReceiptURL(account?.shortCode)}`, '_blank', "height=570,width=520");
  }

  return (
    <div className="shadow-md sm:rounded-lg w-1/2">
      <table className="text-sm text-left text-gray-500 dark:text-gray-400 w-full">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Short Code Details
        </caption>
        <tbody>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Short Code:
            </th>
            <td className="py-4 px-6">
              {account?.shortCode}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Sequence Number:
            </th>
            <td className="py-4 px-6">
              {account?.sequenceNumber}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Account Name:
            </th>
            <td className="py-4 px-6">
              {account?.accountName}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Account Number:
            </th>
            <td className="py-4 px-6">
              {account?.accountNumber}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Approved By
            </th>
            <td className="py-4 px-6">
              {account?.approver}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Approved By
            </th>
            <td className="py-4 px-6">
              {account?.dateApproved}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="bg-gray-200 px-4 py-3 text-right">
        {
          account?.shortCode && <button onClick={downloadShortCode} type="button" className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2">Download ShortCode Details</button>
        }
      </div>
    </div>
  )
}