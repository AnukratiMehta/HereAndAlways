import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      navigate("/dashboard");
    } else {
      navigate("/login"); // fallback if token missing
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl">Logging you in...</p>
    </div>
  );
};

export default OAuthRedirectHandler;
