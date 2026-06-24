import React, { useState } from "react";
import HttpService from "../services/HttpService";
import URLConstants from "../urlsConfig";

function DeleteShortCode() {

    const authedAxios = HttpService.getAxiosClient();

    const [loading, setLoading] = useState(false);

    const handleDeleteRequest = (e) => {

        e.preventDefault();

        setLoading(true);

        const payload = {
            accountNumber: e.target.accountNumber.value,
            shortCode: parseInt(e.target.shortCode.value),
            deleteRemark: e.target.remark.value
        };

        authedAxios.delete(
            `${URLConstants.baseAPIURL}/${URLConstants.deleteShortCodeURL}`,
            { data: payload }
        )
        .then((response) => {

            setLoading(false);

            alert(response.data.message);

            e.target.reset();

        })
        .catch((error) => {

            setLoading(false);

            console.log(error);

            alert("Failed to initiate delete request");

        });

    };

    return (

        <div className="w-1/2">

            <h2 className="text-2xl font-bold mb-4">
                Delete Short Code
            </h2>

            <form onSubmit={handleDeleteRequest}>

                <div className="mb-4">
                    <label>Account Number</label>
                    <input
                        name="accountNumber"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label>Short Code</label>
                    <input
                        name="shortCode"
                        type="number"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label>Reason</label>
                    <textarea
                        name="remark"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    {loading ? "Submitting..." : "Initiate Delete"}
                </button>

            </form>

        </div>

    );
}

export default DeleteShortCode;