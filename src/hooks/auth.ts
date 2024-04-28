import { useNavigate } from "@tanstack/react-router";

export default async function useAuth() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    navigate({ to: "/" });
  }
}
