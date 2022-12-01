import React, { useState } from 'react'
import Loading from './loading/Loading';
import HttpService from '../services/HttpService';
import UserService from '../services/UserService';
import URLConstants from '../urlsConfig';

function RequestShortCode() {
  const authedAxios = HttpService.getAxiosClient();


  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Submiting request")
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
  const handleCustomerLookUp = (e) => {
    e.preventDefault();
    setLoading(true)
    authedAxios.get(`${URLConstants.baseAPIURL}/${URLConstants.validateEndpointURL(e.target.account.value)}`, { timeout: 10000 })
      .then(function (response) {
        console.log(response.data)
        setLoading(false);
        const data = response.data;
        if (data?.accountStatus) {
          setAccountLookupResponse(data)
        } else {
          alert("Could not get that account number")
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
        alert("Could not get that account number")
      });
  }


  const handleShortCodeRequest = () => {
    setLoadingMessage("Submiting shortcode request");
    setLoading(true)
    const payload = {
      "accountName": accountLookupResponse?.accountName,
      "accountNumber": accountLookupResponse?.accountNumber,
      "approved": false,
      "approver": UserService.getUsername(),
      "custId": accountLookupResponse?.custId,
      "dateApproved": new Date(),
      "dateInitiated": new Date(),
      "emailAddress": accountLookupResponse?.emailAddress,
      "id": 0,
      "idNumber": accountLookupResponse?.idNumber,
      "initiator": UserService.getUsername(),
      "phoneNumber": accountLookupResponse?.phoneNumber,
      "shortCode": 0
    }
    authedAxios.post(`${URLConstants.baseAPIURL}/${URLConstants.initateValidationURL}`, payload)
      .then(function (response) {
        setLoading(false);
        const data = response.data;
        if (data?.statusCode === "000") {
          alert(data?.message)
        } else {
          alert("Failed to submit request")
        }
      })
      .catch(function (error) {
        setLoading(false)
        setAccountLookupResponse({})
        if (error.code === 'ECONNABORTED') {
          alert("Query took longer than expected. Try again");
          return
        }
        alert("Failed to submit request")
      });
  }

  return (
    <React.Fragment>
      <div className='mb-6'>
        <form className='w-96' onSubmit={handleCustomerLookUp}>
          <div className="my-2">
            <label for="account" className="block mb-2 text-sm font-medium text-gray-900">Enter Customer Account</label>
            <input type="text" id="account" name='account' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Query Account</button>
        </form>
      </div>
      {loading && <Loading message={loadingMessage} />}
      {accountLookupResponse?.accountStatus &&
        <React.Fragment>
          <LookupComponent account={accountLookupResponse} />
          <button onClick={handleShortCodeRequest} type="button" class="text-white bg-blue-700
       hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 
       font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center my-4
        ">
            Request For ShortCode
          </button>
        </React.Fragment>
      }

    </React.Fragment>
  )
}


export default RequestShortCode


const LookupComponent = ({ account }) => {
  return (
    <div className="shadow-md sm:rounded-lg w-1/2">
      <table className="text-sm text-left text-gray-500 dark:text-gray-400 w-full">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Account Details
        </caption>
        <tbody>
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
              Status
            </th>
            <td className="py-4 px-6">
              {account?.accountStatus}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}