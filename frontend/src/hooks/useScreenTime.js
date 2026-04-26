import { useState, useEffect, useRef, useCallback } from "react";
import { getScreenTimeStatus, updateScreenTimeUsage } from "../services/api";

const UPDATE_INTERVAL = 30; // seconds between backend syncs

const useScreenTime = () => {
  const [status, setStatus] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const localSecondsRef = useRef(0);
  const intervalRef = useRef(null);
  const syncIntervalRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Fetch initial status
  const fetchStatus = useCallback(async () => {
    if (!user?.id || user.role !== "child") {
      setLoading(false);
      return;
    }

    try {
      const { data } = await getScreenTimeStatus(user.id);
      setStatus(data);
      setIsLocked(data.isLocked);
      localSecondsRef.current = 0;
    } catch (err) {
      console.error("Screen time fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.role]);

  // Sync usage to backend
  const syncUsage = useCallback(async () => {
    const seconds = localSecondsRef.current;
    if (seconds <= 0) return;

    try {
      const { data } = await updateScreenTimeUsage({ seconds });
      localSecondsRef.current = 0;
      setIsLocked(data.isLocked);

      // Update status locally
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              usedTime: data.usedTime,
              isLocked: data.isLocked,
              remainingSeconds: data.remainingSeconds,
            }
          : prev
      );
    } catch (err) {
      console.error("Screen time sync error:", err);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "child") return;

    fetchStatus();

    // Tick every second
    intervalRef.current = setInterval(() => {
      localSecondsRef.current += 1;
    }, 1000);

    // Sync to backend every UPDATE_INTERVAL seconds
    syncIntervalRef.current = setInterval(() => {
      syncUsage();
    }, UPDATE_INTERVAL * 1000);

    return () => {
      // Sync remaining time on unmount
      syncUsage();
      clearInterval(intervalRef.current);
      clearInterval(syncIntervalRef.current);
    };
  }, [user?.role, fetchStatus, syncUsage]);

  return { status, isLocked, loading, refetch: fetchStatus };
};

export default useScreenTime;
