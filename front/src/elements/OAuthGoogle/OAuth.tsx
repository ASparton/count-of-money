import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const envVars = import.meta.env;

const OAuth: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-full">
      <GoogleOAuthProvider clientId={envVars.VITE_OAUTH_GOOGLE}>
        <GoogleLogin
          shape="circle"
          theme="filled_black"
          onSuccess={(credentialResponse) => {
            const { email, name } = jwtDecode(
              credentialResponse.credential ?? ""
            ) as { [key: string]: string };
            console.log(email, name);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default OAuth;
