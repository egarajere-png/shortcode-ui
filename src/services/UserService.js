import Keycloak from "keycloak-js";

const _kc = new Keycloak({
  realm: process.env.REACT_APP_REALM,
  url: process.env.REACT_APP_KEYCLOAK_SERVER,
  clientId: process.env.REACT_APP_CLIENT_ID
});

const initKeycloak = (onAuthenticatedCallback) => {
  _kc.init({
    onLoad: "login-required",
    silentCheckSsoRedirectUri:
      window.location.origin + "/silent-check-sso.html",
    pkceMethod: "S256",
    checkLoginIframe: false
  })
  .then(() => {
    onAuthenticatedCallback();
  })
  .catch(console.error);
};

const doLogin = () => _kc.login();

const doLogout = () =>
    _kc.logout({
        redirectUri: window.location.origin
    });
    
const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () =>
  _kc.tokenParsed?.preferred_username;

const hasRole = (roles) =>
  roles.some(role => _kc.hasRealmRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole
};

export default UserService;