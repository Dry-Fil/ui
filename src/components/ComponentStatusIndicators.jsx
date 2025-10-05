import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { useEsp32 } from "@/context/esp32Context";

export function ComponentStatusIndicators() {
  const { esp32State } = useEsp32();

  const getStatusColor = (state) => (state ? "bg-green-500" : "bg-red-500");
  const getStatusText = (state) => (state ? "ON" : "OFF");

  return (
    <Card className="mt-6 p-4">
      <Typography variant="h5" color="blue-gray" className="mb-4">
        Component Status
      </Typography>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${getStatusColor(esp32State.heater_state)} mb-2`}></div>
          <Typography variant="h6" color="blue-gray">Heater</Typography>
          <Typography variant="small" color="gray">{getStatusText(esp32State.heater_state)}</Typography>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${getStatusColor(esp32State.fan_intake_state)} mb-2`}></div>
          <Typography variant="h6" color="blue-gray">Intake Fan</Typography>
          <Typography variant="small" color="gray">{getStatusText(esp32State.fan_intake_state)}</Typography>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${getStatusColor(esp32State.fan_exhaust_state)} mb-2`}></div>
          <Typography variant="h6" color="blue-gray">Exhaust Fan</Typography>
          <Typography variant="small" color="gray">{getStatusText(esp32State.fan_exhaust_state)}</Typography>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${getStatusColor(esp32State.fan_distributor_state)} mb-2`}></div>
          <Typography variant="h6" color="blue-gray">Heat Distributor Fan</Typography>
          <Typography variant="small" color="gray">{getStatusText(esp32State.fan_distributor_state)}</Typography>
        </div>
      </div>
    </Card>
  );
}
