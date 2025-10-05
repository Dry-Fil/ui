import { ESP32_IP_ADDRESS } from "@/configs/appConfig";

const API_BASE_URL = ESP32_IP_ADDRESS;

export const getSensorData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return null;
  }
};

/**
 * Toggles the state of a device via WebSocket.
 * This function now accepts `sendCommand` from the Esp32Context.
 *
 * @param {function} sendCommand - The sendCommand function from Esp32Context.
 * @param {string} device - The name of the device (e.g., "heater_state", "fan_intake_state").
 * @param {boolean} newState - The desired state (true for ON, false for OFF).
 */
export const toggleDevice = (sendCommand, device, newState) => {
  const commandMap = {
    "heater_state": "SET_HEATER",
    "fan_intake_state": "SET_FAN_INTAKE",
    "fan_exhaust_state": "SET_FAN_EXHAUST",
    "fan_distributor_state": "SET_FAN_DISTRIBUTOR",
  };

  const wsCommand = commandMap[device];

  if (wsCommand) {
    sendCommand(wsCommand, { state: newState });
    console.log(`Command sent via WebSocket: ${wsCommand} with state ${newState}`);
  } else {
    console.error(`Unknown device for WebSocket control: ${device}`);
  }
};

/**
 * Sets the operating mode of the dehydrator (AUTOMATIC or MANUAL).
 * This function now accepts `sendCommand` from the Esp32Context.
 *
 * @param {function} sendCommand - The sendCommand function from Esp32Context.
 * @param {string} mode - The desired mode ("AUTOMATIC" or "MANUAL").
 */
export const setMode = (sendCommand, mode) => {
  if (mode === "AUTOMATIC" || mode === "MANUAL") {
    sendCommand("SET_MODE", { mode });
  } else {
    console.error(`Invalid mode: ${mode}`);
  }
};

/**
 * Starts an automatic dehydration cycle.
 * This function now accepts `sendCommand` from the Esp32Context.
 *
 * @param {function} sendCommand - The sendCommand function from Esp32Context.
 * @param {number} target_temp - The target temperature for the automatic cycle.
 * @param {number} duration_hours - The duration of the cycle in hours.
 */
export const startAutomaticCycle = (sendCommand, target_temp, duration_hours) => {
  sendCommand("START_AUTOMATIC", { target_temp, duration_hours });
};

/**
 * Stops any currently running dehydration cycle (automatic or manual).
 * This function now accepts `sendCommand` from the Esp32Context.
 *
 * @param {function} sendCommand - The sendCommand function from Esp32Context.
 */
export const stopCycle = (sendCommand) => {
  sendCommand("STOP_CYCLE");
};
