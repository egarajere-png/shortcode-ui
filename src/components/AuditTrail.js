import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HttpService from "../services/HttpService";
import URLConstants from "../urlsConfig";

function AuditTrail() {

    const { shortCode } = useParams();

    const [auditRecords, setAuditRecords] = useState([]);

    const authedAxios = HttpService.getAxiosClient();

    useEffect(() => {

        authedAxios
            .get(
                `${URLConstants.baseAPIURL}/audit/${shortCode}`
            )
            .then((response) => {

                setAuditRecords(response.data);

            })
            .catch((error) => {

                console.log(error);
                alert("Failed to load audit trail");

            });

    }, [shortCode]);

    return (
        <div>

            <h2 className="text-2xl font-bold mb-4">
                Audit Trail - {shortCode}
            </h2>

            <table className="w-full border">

                <thead>

                    <tr className="bg-gray-100">

                        <th className="p-3 border">
                            Action
                        </th>

                        <th className="p-3 border">
                            Performed By
                        </th>

                        <th className="p-3 border">
                            Remarks
                        </th>

                        <th className="p-3 border">
                            Date
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {auditRecords.map((item, index) => (

                        <tr key={index}>

                            <td className="border p-2">
                                {item.action}
                            </td>

                            <td className="border p-2">
                                {item.performedBy}
                            </td>

                            <td className="border p-2">
                                {item.remarks}
                            </td>

                            <td className="border p-2">
                                {item.actionDate}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default AuditTrail;