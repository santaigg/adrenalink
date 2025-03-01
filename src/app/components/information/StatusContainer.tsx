"use client";

import { useState, useEffect, useRef } from "react";

interface dumpStatus {
  success: boolean;
  is_priority: boolean;
  queue_position: number | null;
  initially_dumped: boolean;
  in_progress: boolean;
  last_updated: number | null;
}

function LoadingBar({ loadingMessage }: { loadingMessage: string }) {
  return (
    <div className="flex flex-col items-center text-accent w-full">
      <p className="text-accent text-sm font-bold mb-2 text-center">
        {loadingMessage}
      </p>
      <ul className="flex justify-center w-full max-w-[500px] h-[10px] p-0 list-none">
        <li className="w-full h-[10px] mr-[10px] bg-accent bg-opacity-90 shadow-[inset_0px_0px_10px_2px_hsla(73,97%,50%,0.5),0px_0px_20px_hsla(73,97%,50%,0.5)]"></li>
        <li className="w-full h-[10px] mr-[10px] bg-accent bg-opacity-90 shadow-[inset_0px_0px_10px_2px_hsla(73,97%,50%,0.5),0px_0px_20px_hsla(73,97%,50%,0.5)]"></li>
        <li className="w-full h-[10px] mr-[10px] bg-accent bg-opacity-90 shadow-[inset_0px_0px_10px_2px_hsla(73,97%,50%,0.5),0px_0px_20px_hsla(73,97%,50%,0.5)] animate-pulse"></li>
        <li className="w-full h-[10px] mr-[10px] shadow-[inset_0px_0px_10px_1px_hsla(73,97%,50%,0.4),0px_0px_20px_hsla(73,97%,50%,0.1)]"></li>
        <li className="w-full h-[10px] shadow-[inset_0px_0px_10px_1px_hsla(73,97%,50%,0.4),0px_0px_20px_hsla(73,97%,50%,0.1)]"></li>
      </ul>
    </div>
  );
}

interface dumpStatus {
  success: boolean;
  is_priority: boolean;
  queue_position: number | null;
  initially_dumped: boolean;
  in_progress: boolean;
  last_updated: number | null;
}

export default function StatusContainer({
  dumpData,
  playerId,
}: {
  dumpData: dumpStatus | null;
  playerId: string;
}) {
  const defaultDumpStatus: dumpStatus = {
    success: false,
    is_priority: false,
    queue_position: null,
    initially_dumped: false,
    in_progress: false,
    last_updated: null,
  };

  const [dumpStatus, setDumpStatus] = useState<dumpStatus>(
    dumpData ?? defaultDumpStatus
  );
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

  async function checkDumpStatus() {
    try {
      const response = await fetch(
        `https://wavescan-production.up.railway.app/api/v1/player/${playerId}/dump_status`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const updatedDumpStatus = (await response.json()) as dumpStatus;

      setDumpStatus((prev) => ({ ...prev, ...updatedDumpStatus }));
    } catch (error) {
      console.error("Error checking dump status:", error);
    }
  }

  async function initiateDump() {
    try {
      const response = await fetch(
        `https://wavescan-production.up.railway.app/api/v1/player/${playerId}/dump`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const dumpData = (await response.json()) as dumpStatus;

      if (dumpData.success) {
        setDumpStatus((prev) => ({
          ...prev,
          in_progress: true,
          queue_position: dumpData.queue_position,
        }));
      }

      startPeriodicStatusCheck();
    } catch (error) {
      console.error("Error initiating dump:", error);
    }
  }

  function startPeriodicStatusCheck() {
    stopPeriodicStatusCheck();
    statusCheckInterval.current = setInterval(checkDumpStatus, 10000);
  }

  function stopPeriodicStatusCheck() {
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
      statusCheckInterval.current = null;
    }
  }

  useEffect(() => {
    if (dumpStatus.in_progress) {
      startPeriodicStatusCheck();
    } else {
      stopPeriodicStatusCheck();
    }

    return () => stopPeriodicStatusCheck();
  }, [dumpStatus.in_progress]);

  useEffect(() => {
    checkDumpStatus();
    return () => stopPeriodicStatusCheck();
  }, []);

  return (
    <div className="flex items-center justify-center text-accent w-full">
      {dumpStatus.in_progress ? (
        <LoadingBar
          loadingMessage={
            dumpStatus.queue_position !== null && dumpStatus.queue_position > 0
              ? `Processing your matches soon... Queue position: ${
                  dumpStatus.queue_position - 1
                }`
              : "Processing matches... This may take a while."
          }
        />
      ) : !dumpStatus.initially_dumped ? (
        <div className="flex flex-col items-center justify-center space-y-2">
          <p>This player has not been tracked yet.</p>
          <div
            className="h-9 px-3 bg-accent text-accent-foreground cursor-pointer flex items-center justify-center font-medium rounded-primary"
            onClick={initiateDump}
          >
            <p>Start Tracking Matches</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
