import HttpService from "./HttpService";

const client = HttpService.getAxiosClient();

const getAnalytics = () => {
    return client.get("/analytics");
};

export default {
    getAnalytics,
};