// src/auth/auth.jsx
import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const AuthProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-m0zcirwuh5xgmp4f.eu.auth0.com";
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "VNN9LCGd9ovQLQkYrJ36zUce6uQPLpgg";
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE || "https://clicks-hr.api";

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || "/");
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
        scope: "openid profile email read:users", // Add necessary scopes
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProviderWithNavigate;