import React, { useState, useEffect } from 'react';
import axios from 'axios';

const C2B = () => {
    const [token, setToken] = useState("");
    const [formData, setFormData] = useState({
        phone_number: '',
        amount: 10,
        account: '',
        shortcode: "600978"
    });
    const [submissionResult, setSubmissionResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getBearerToken = () => {
        let data = JSON.stringify({
            "userName": process.env.REACT_APP_DARAJA_USER,
            "password": process.env.REACT_APP_DARAJA_USER_PASSWORD
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_MPESA_API_BASE_URL}/auth/django-daraja/auth-token`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setToken(response.data.access_token)
            })
            .catch((error) => {
                console.log(error);
                setToken("")
            });

    }

    useEffect(() => {
        getBearerToken();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_MPESA_API_BASE_URL}/c2b/simulate`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setSubmissionResult(response.data);
        } catch (error) {
            setSubmissionResult('An error occurred while submitting the form.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    return (
        <div>
            <h1 className="text-1xl my-3 font-extrabold max-w-md mx-auto">Simulate Customer to Busines Transactions</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="phone_number" className="block mb-2 font-medium text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="amount" className="block mb-2 font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min={1}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="account" className="block mb-2 font-medium text-gray-700">Account/Customer A/C Short Code</label>
                    <input
                        type="text"
                        id="account"
                        name="account"
                        value={formData.account}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="shortcode" className="block mb-2 font-medium text-gray-700">Shortcode</label>
                    <input
                        type="number"
                        id="shortcode"
                        name="shortcode"
                        value={formData.shortcode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        disabled
                    />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>            </form>
            {submissionResult && (
                <div className="mt-4">
                    <h3 className="mb-2 font-medium text-gray-700">Submission Result</h3>
                    <pre className="bg-gray-100 p-4">{JSON.stringify(submissionResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default C2B;
