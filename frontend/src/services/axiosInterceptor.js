import axios from "axios";
import { toast } from "react-toastify";

let hasShownExpiredToast = false;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

      // Only handle if user was previously logged in (session expired)
      // Don't interfere with login page 401s (wrong password)
      if (isLoggedIn) {
        sessionStorage.clear();

        if (!hasShownExpiredToast) {
          hasShownExpiredToast = true;
          toast.error("Session expired. Please login again.");

          // Reset flag after redirect so it can fire again next time
          setTimeout(() => {
            hasShownExpiredToast = false;
          }, 3000);
        }

        // Redirect to login page
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
