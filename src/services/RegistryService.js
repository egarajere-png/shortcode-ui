import HttpService from "./HttpService";
import URLConstants from "../urlsConfig";

const authedAxios = HttpService.getAxiosClient();

class RegistryService {

    getRegistry() {
        return authedAxios.get(
            `${URLConstants.baseAPIURL}/${URLConstants.registryURL}`
        );
    }

    exportRegistryExcel(status = "") {
        authedAxios({
            url: `${URLConstants.baseAPIURL}/registry/export/excel?status=${status}`,
            method: "GET",
            responseType: "blob",
        }).then((response) => {

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "ShortcodeRegistry.xlsx";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        });
    }

    exportRegistryPdf() {
        authedAxios({
            url: `${URLConstants.baseAPIURL}/registry/export/pdf`,
            method: "GET",
            responseType: "blob",
        }).then((response) => {

            const blob = new Blob([response.data], {
                type: "application/pdf",
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "ShortcodeRegistry.pdf";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        });
    }
}

export default new RegistryService();