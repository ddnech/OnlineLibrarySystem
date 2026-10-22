import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";

export function useGenres() {
  const [genres, setGenres] = useState([]);

  const reload = useCallback(async () => {
    try {
      const { data } = await api.get("/genre");
      setGenres(data.data);
    } catch {
      setGenres([]);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { genres, reload };
}
