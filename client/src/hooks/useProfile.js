import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const reload = useCallback(async () => {
    try {
      const { data } = await api.get("/users/profile");
      setProfile(data.data);
    } catch {
      setProfile(null);
    }
  }, []);
  useEffect(() => {
    reload();
  }, [reload]);
  return { profile, reload };
}
