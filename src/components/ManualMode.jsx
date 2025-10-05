import React from "react";
import { Card, Typography, Switch, Alert } from "@material-tailwind/react"; // Added Alert
import { useEsp32 } from "@/context/esp32Context";
import { useMaterialTailwindController } from "@/context";

export function ManualMode() {
  const { esp32State, sendCommand } = useEsp32();
  const [controller] = useMaterialTailwindController();
  const { theme } = controller;

  const isDarkMode = theme === "dark";

  const handleToggle = (component, state) => {
    let command;
    switch (component) {
      case "heater":
        command = "SET_HEATER";
        break;
      case "intake_fan":
        command = "SET_FAN_INTAKE";
        break;
      case "exhaust_fan":
        command = "SET_FAN_EXHAUST";
        break;
      case "heat_distributor_fan":
        command = "SET_FAN_DISTRIBUTOR";
        break;
      default:
        return;
    }
    sendCommand(command, { state: state });
  };

  return (
    <Card className={`mt-6 p-4 ${isDarkMode ? "dark:bg-gray-800" : "bg-white"}`}>
      <Typography variant="h5" color={isDarkMode ? "white" : "blue-gray"} className="mb-4">
        Manual Mode
      </Typography>
      <Alert color="orange" className="mb-4">
        Manual mode active. Monitor temperature closely!
      </Alert>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <Typography variant="h6" color={isDarkMode ? "white" : "blue-gray"}>
            Heater
          </Typography>
          <Switch
            id="heater-switch"
            checked={esp32State.heater_state}
            onChange={(e) => handleToggle("heater", e.target.checked)}
            color="red"
          />
        </div>
        <div className="flex items-center justify-between">
          <Typography variant="h6" color={isDarkMode ? "white" : "blue-gray"}>
            Intake Fan
          </Typography>
          <Switch
            id="intake-fan-switch"
            checked={esp32State.fan_intake_state}
            onChange={(e) => handleToggle("intake_fan", e.target.checked)}
            color="blue"
          />
        </div>
        <div className="flex items-center justify-between">
          <Typography variant="h6" color={isDarkMode ? "white" : "blue-gray"}>
            Exhaust Fan
          </Typography>
          <Switch
            id="exhaust-fan-switch"
            checked={esp32State.fan_exhaust_state}
            onChange={(e) => handleToggle("exhaust_fan", e.target.checked)}
            color="blue"
          />
        </div>
        <div className="flex items-center justify-between">
          <Typography variant="h6" color={isDarkMode ? "white" : "blue-gray"}>
            Heat Distributor Fan
          </Typography>
          <Switch
            id="heat-distributor-fan-switch"
            checked={esp32State.fan_distributor_state}
            onChange={(e) => handleToggle("heat_distributor_fan", e.target.checked)}
            color="blue"
          />
        </div>
      </div>
    </Card>
  );
}
