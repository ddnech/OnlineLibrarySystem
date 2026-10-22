import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";

export function useAdminStats() {
  const [stats, setStats] = useState(null);
  const reload = useCallback(async () => {
    try {
      const { data } = await api.get("/admins/stats");
      setStats(data.data);
    } catch {
      setStats(null);
    }
  }, []);
  useEffect(() => {
    reload();
  }, [reload]);
  return { stats, reload };
}
