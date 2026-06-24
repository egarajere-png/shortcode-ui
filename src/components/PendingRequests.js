import React, { useEffect, useState } from 'react';
import URLConstants from '../urlsConfig';
import Loading from './loading/Loading';
import HttpService from '../services/HttpService';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';


function PendingRequests() {

    const [pending, setPending] = useState();
    const [loading, setLoading] = useState(false);
    //const [loadingMessage,] = useState("Loading Pending Requests");
    const [viewItem, setViewItem] = React.useState([])

    const authedAxios = HttpService.getAxiosClient();


    const showModal = (item) => {
        document.getElementById('modal').classList.toggle('hidden')
        setViewItem(item)
    }

    const getPending = () => {
        authedAxios.get(`${URLConstants.baseAPIURL}/${URLConstants.pendingRequestURL}`, { timeout: 5000 })
            .then(function (response) {
                console.log(response.data)
                setLoading(false);
                const data = response.data;
                setPending(data)
            })
            .catch(function (error) {
                console.log(error)
                setLoading(false)
                if (error.code === 'ECONNABORTED') {
                    alert("Query took longer than expected. Try again");
                    return
                }
                alert("Could not get that account number")
            });
    }


    const getPendingv2 = () => {
        authedAxios.get(`${URLConstants.baseAPIURL}/${URLConstants.pendingRequestURL}`, { timeout: 5000 })
            .then(function (response) {
                const data = response.data;
                setPending(data)
            })
            .catch(function (error) {
                if (error.code === 'ECONNABORTED') {
                    return
                }
            });
    }

    useEffect(() => {
        getPending()
    }, [])

    return (
        <div>
            <div class="overflow-x-auto relative">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="py-3 px-6">
                                Account Name
                            </th>
                            <th scope="col" class="py-3 px-6">
                                Account No.
                            </th>
                            <th scope="col" class="py-3 px-6">
                                Request By
                            </th>
                            <th scope="col" class="py-3 px-6">
                                Approve
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pending?.map(item => (
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.accountName}
                                    </th>
                                    <td class="py-4 px-6">
                                        {item.accountNumber}
                                    </td>
                                    <td class="py-4 px-6">
                                        {item.initiator}
                                    </td>
                                    <td class="py-4 px-6">
                                        <button type="button" onClick={() => showModal(item)}
                                            class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none
                  bg-white rounded-lg border border-gray-200 hover:bg-gray-100
                   hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
                                            Approve
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <EslipModal payload={viewItem} getPending={getPendingv2} />
            {/* <Loading message={loadingMessage} /> */}
        </div>
    )
}


const EslipModal = ({ payload, getPending }) => {
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [downloadView, showDownloadView] = React.useState(false);
    const [shortCodeResponse, setShortCodeResponse] = useState({})

    const authedAxios = HttpService.getAxiosClient();
    const navigate = useNavigate();

    const toggleModal = () => {
        document.getElementById('modal').classList.toggle('hidden')
    }

    const downloadReceipt = () => {
        document.getElementById('modal').classList.toggle('hidden')
        window.open(`${URLConstants.baseURL}/${URLConstants.getReceiptURL(shortCodeResponse?.shortCode)}`, '_blank', "height=570,width=520");
        showDownloadView(false)
    }

    const approveShortCodeRequest = () => {

    if (loading) return;

    setLoading(true);
    setMessage("Approving shortcode Request");

    const requestPayload = {
        accountNumber: payload?.accountNumber,
        approver: UserService.getUsername()
    };

    authedAxios.post(
        `${URLConstants.baseAPIURL}/${URLConstants.approveURL}`,
        requestPayload
    )
    .then(function (response) {

        const data = response.data;

        if (data.approved) {

            setShortCodeResponse(data);
            showDownloadView(true);

            alert("Short code generated successfully. Click okay to download");

            navigate("/pending");

            getPending();

        } else {

            alert("Failed to approve shortcode");

        }

        setLoading(false);

    })
    .catch(function (error) {

        setLoading(false);
        setShortCodeResponse({});

        if (error.code === "ECONNABORTED") {

            alert("Query took longer than expected. Try again");
            return;

        }

        alert("Failed to submit request");

    });

};

    return (
        <React.Fragment>
            <div className="fixed z-10 overflow-y-auto top-0 w-full left-0 hidden" id="modal">
                <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-900 opacity-75" />
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                    <div className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <h4 class="font-medium leading-tight text-2xl py-4 px-4 mx-auto w-full">Approve Shortcode Request</h4>
                        <div className="bg-white px-4 pt-1 pb-4 sm:p-6 sm:pb-4">
                            <table className="w-98 text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6 bg-gray-50 dark:bg-gray-800">
                                            Account Name
                                        </th>
                                        <td className="py-3 px-6">
                                            {payload?.accountName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="col" className="py-3 px-6 bg-gray-50 dark:bg-gray-800">
                                            Account Number                                        </th>
                                        <td className="py-3 px-6">
                                            {payload?.accountNumber}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="col" className="py-3 px-6 bg-gray-50 dark:bg-gray-800">
                                            Initiated By
                                        </th>
                                        <td className="py-3 px-6">
                                            {payload?.initiator}
                                        </td>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                     <div className="bg-gray-200 px-4 py-3 text-right">

    <button
        type="button"
        className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
        onClick={toggleModal}
    >
        Cancel
    </button>

    {downloadView &&
        <button
            onClick={downloadReceipt}
            type="button"
            className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
        >
            Download Details
        </button>
    }

    <button
        type="button"
        disabled={loading}
        className={`py-2 px-4 text-white rounded mr-2 ${
            loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
        }`}
        onClick={approveShortCodeRequest}
    >
        {loading ? "Approving..." : "Approve Request"}
    </button>

</div>
                    </div>
                </div>
            </div>
            {loading && <Loading message={message} />}
        </React.Fragment>
    )
}

export default PendingRequests


