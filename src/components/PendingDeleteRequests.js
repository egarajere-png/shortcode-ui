import React, { useEffect, useState } from "react";
import HttpService from "../services/HttpService";
import URLConstants from "../urlsConfig";

function PendingDeleteRequests() {

    const authedAxios = HttpService.getAxiosClient();

    const [requests, setRequests] = useState([]);

    const loadRequests = () => {

        authedAxios
            .get(
                `${URLConstants.baseAPIURL}/${URLConstants.pendingDeleteURL}`
            )
            .then((response) => {

                setRequests(response.data);

            })
            .catch((error) => {

                console.log(error);

                alert("Failed to load pending deletes");

            });

    };

    useEffect(() => {

        loadRequests();

    }, []);

    const approveDelete = (item) => {

        const payload = {

            accountNumber: item.accountNumber,
            shortCode: item.shortCode

        };

        authedAxios
            .post(
                `${URLConstants.baseAPIURL}/${URLConstants.approveDeleteURL}`,
                payload
            )
            .then((response) => {

                alert(response.data.message);

                loadRequests();

            })
            .catch((error) => {

                console.log(error);

                alert("Failed to approve delete");

            });

    };

    return (

        <div>

            <h2 className="text-2xl font-bold mb-4">
                Pending Delete Requests
            </h2>

            <table className="w-full border">

                <thead>

                    <tr>

                        <th className="border p-2">
                            Account Number
                        </th>

                        <th className="border p-2">
                            Account Name
                        </th>

                        <th className="border p-2">
                            Short Code
                        </th>

                        <th className="border p-2">
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {requests.map((item) => (

                        <tr key={item.id}>

                            <td className="border p-2">
                                {item.accountNumber}
                            </td>

                            <td className="border p-2">
                                {item.accountName}
                            </td>

                            <td className="border p-2">
                                {item.shortCode}
                            </td>

                            <td className="border p-2">

                                <button
                                    onClick={() => approveDelete(item)}
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Approve Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}

export default PendingDeleteRequests;