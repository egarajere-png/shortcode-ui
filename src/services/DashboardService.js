import HttpService from "./HttpService";

const client = HttpService.getAxiosClient();

const getAnalytics = () => {
    return client.get("dashboard/analytics");
};

export default {
    getAnalytics,
};