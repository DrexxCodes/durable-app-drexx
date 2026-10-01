import { useEffect } from "react";
import { useNavigate } from "@/lib/router";

/** Logged-in "/" simply forwards to the dashboard. */
const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);
  return null;
};

export default Home;
