import HttpService from "./HttpService";

const client = HttpService.getAxiosClient();

const getAnalytics = () => {
    return client.get(
        `${process.env.REACT_APP_BASE_URL}/dashboard/analytics`
    );
};

export default {
    getAnalytics,
};