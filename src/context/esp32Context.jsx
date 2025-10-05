import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { ESP32_IP_ADDRESS } from "@/configs/appConfig";

const Esp32Context = createContext(null);

export const Esp32Provider = ({ children }) => {
  const [esp32State, setEsp32State] = useState({
    current_temp: 0,
    pressure: 0,
    humidity: 0,
    mode: "MANUAL",
    target_temp: 0,
    remaining_time: 0,
    heater_state: false,
    intake_fan_state: false,
    exhaust_fan_state: false,
    heat_distributor_fan_state: false,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const ws = useRef(null);
  const reconnectIntervalRef = useRef(1000);
  const maxReconnectInterval = 30000;
  const reconnectAttemptsRef = useRef(0);

  useEffect(() => {
    const connectWebSocket = () => {
      if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
        return;
      }

      console.log(`Attempting WebSocket connection to ws://${ESP32_IP_ADDRESS.replace('http://', '')}:81...`);
      ws.current = new WebSocket(`ws://${ESP32_IP_ADDRESS.replace('http://', '')}:81`);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        reconnectIntervalRef.current = 1000;
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setEsp32State((prevState) => ({ ...prevState, ...data }));
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);
        reconnectAttemptsRef.current++;
        const currentReconnectInterval = Math.min(reconnectIntervalRef.current * Math.pow(2, reconnectAttemptsRef.current - 1), maxReconnectInterval);
        setError(`WebSocket disconnected. Attempting to reconnect in ${currentReconnectInterval / 1000} seconds... (Attempt ${reconnectAttemptsRef.current})`);
        setTimeout(connectWebSocket, currentReconnectInterval);
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("WebSocket error. Attempting to reconnect...");
        ws.current.close();
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendCommand = (command, payload = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ command, ...payload }));
    } else {
      console.warn("WebSocket not connected. Command not sent:", command, payload);
      setError("WebSocket not connected. Please wait for reconnection.");
    }
  };

  return (
    <Esp32Context.Provider value={{ esp32State, isConnected, error, sendCommand }}>
      {children}
    </Esp32Context.Provider>
  );
};

export const useEsp32 = () => {
  const context = useContext(Esp32Context);
  if (context === null) {
    throw new Error("useEsp32 must be used within an Esp32Provider");
  }
  return context;
};
