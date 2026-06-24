import React, { useState } from "react";
import HttpService from "../services/HttpService";
import URLConstants from "../urlsConfig";
import UserService from "../services/UserService";

function TestShortCodeRequest() {

    const authedAxios = HttpService.getAxiosClient();

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {

        e.preventDefault();

        setLoading(true);

        const payload = {

            id: 0,

            initiator: UserService.getUsername(),
            approver: "",

            accountNumber: e.target.accountNumber.value,
            accountName: e.target.accountName.value,

            phoneNumber: e.target.phoneNumber.value,
            emailAddress: e.target.emailAddress.value,

            idNumber: e.target.idNumber.value,
            custId: e.target.custId.value,

            remark: e.target.remark.value,

            deleteRemark: "",

            shortCode: 0,
            sequenceNumber: 0,

            approved: false,
            deleteInitiated: false,
            deleted: false,

            hash: ""
        };

        authedAxios.post(
            `${URLConstants.baseAPIURL}/${URLConstants.initateValidationURL}`,
            payload
        )
        .then((response) => {

            setLoading(false);

            alert(response.data.message);

            e.target.reset();

        })
        .catch((error) => {

            setLoading(false);

            console.log(error);

            alert("Failed to create shortcode request");

        });
    };

    return (
        <div className="w-1/2">

            <h2 className="text-2xl font-bold mb-4">
                Test Short Code Request
            </h2>

            <form onSubmit={handleSubmit}>

                <input
                    name="accountNumber"
                    placeholder="Account Number"
                    className="border p-2 w-full mb-3"
                    required
                />

                <input
                    name="accountName"
                    placeholder="Account Name"
                    className="border p-2 w-full mb-3"
                    required
                />

                <input
                    name="custId"
                    placeholder="Customer ID"
                    className="border p-2 w-full mb-3"
                    required
                />

                <input
                    name="idNumber"
                    placeholder="ID Number"
                    className="border p-2 w-full mb-3"
                    required
                />

                <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    className="border p-2 w-full mb-3"
                    required
                />

                <input
                    name="emailAddress"
                    placeholder="Email Address"
                    className="border p-2 w-full mb-3"
                    required
                />

                <textarea
                    name="remark"
                    placeholder="Remark"
                    className="border p-2 w-full mb-3"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {loading ? "Submitting..." : "Create Request"}
                </button>

            </form>

        </div>
    );
}

export default TestShortCodeRequest;