import HttpService from "./HttpService";

const client = HttpService.getAxiosClient();

const getRegistry = () => {
    return client.get("/registry");
};

const RegistryService = {
    getRegistry,
};

export default RegistryService;