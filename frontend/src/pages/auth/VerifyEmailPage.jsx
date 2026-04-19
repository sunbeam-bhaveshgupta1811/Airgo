import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmailApi } from "../../services/auth/user";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return navigate("/verify-failed");

    verifyEmailApi(token).then((res) => {
      if (res.success) {
        navigate("/auth/login"); 
      } else {
        navigate("/verify-failed"); 
      }
    });
  }, [token, navigate]);

  return <div>Verifying your account...</div>;
}

export default VerifyEmailPage;
