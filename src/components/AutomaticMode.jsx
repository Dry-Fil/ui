import React, { useState } from "react";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { useEsp32 } from "@/context/esp32Context";

export function AutomaticMode() {
  const { esp32State, sendCommand } = useEsp32();
  const [targetTempInput, setTargetTempInput] = useState(esp32State.target_temp || 45);
  const [dryingDurationInput, setDryingDurationInput] = useState(esp32State.remaining_time / 3600 || 2); // Convert seconds to hours

  const isCycleActive = esp32State.mode === "AUTOMATIC" && esp32State.remaining_time > 0;

  const handleStartCycle = () => {
    const targetTemp = parseFloat(targetTempInput);
    const dryingDuration = parseFloat(dryingDurationInput); // in hours

    if (isNaN(targetTemp) || targetTemp < 45 || targetTemp > 70) {
      alert("Target Temperature must be between 45°C and 70°C.");
      return;
    }
    if (isNaN(dryingDuration) || dryingDuration < 2 || dryingDuration > 12) {
      alert("Drying Duration must be between 2 and 12 hours.");
      return;
    }

    sendCommand("START_AUTOMATIC", {
      target_temp: targetTemp,
      drying_duration: dryingDuration * 3600, // Convert hours to seconds
    });
  };

  const handleStopCycle = () => {
    sendCommand("STOP_CYCLE");
  };

  const formatRemainingTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hours, ${minutes} minutes`;
  };

  return (
    <Card className="mt-6 p-4">
      <Typography variant="h5" color="blue-gray" className="mb-4">
        Automatic Mode
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Input
            label="Target Temperature (°C)"
            type="number"
            min="45"
            max="70"
            value={targetTempInput}
            onChange={(e) => setTargetTempInput(e.target.value)}
            disabled={isCycleActive}
          />
        </div>
        <div>
          <Input
            label="Drying Duration (hours)"
            type="number"
            min="2"
            max="12"
            value={dryingDurationInput}
            onChange={(e) => setDryingDurationInput(e.target.value)}
            disabled={isCycleActive}
          />
        </div>
      </div>

      <div className="mb-4">
        <Typography variant="h6" color="blue-gray">
          Current Target Temperature: {esp32State.target_temp}°C
        </Typography>
        <Typography variant="h6" color="blue-gray">
          Remaining Time: {formatRemainingTime(esp32State.remaining_time)}
        </Typography>
      </div>

      <Button
        color={isCycleActive ? "red" : "green"}
        onClick={isCycleActive ? handleStopCycle : handleStartCycle}
        className="w-full py-3 text-lg"
      >
        {isCycleActive ? "Stop Cycle" : "Start Cycle"}
      </Button>
    </Card>
  );
}
