import { getSession } from "next-auth/react";
import { OpenAPI } from "./core/OpenAPI";

OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

OpenAPI.TOKEN = async () => {
  const session = await getSession();
  return session?.idToken ?? "";
};
