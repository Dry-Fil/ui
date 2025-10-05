import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter, // Added CardFooter
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  InformationCircleIcon, // Fallback generic icon
  ClockIcon,
  SunIcon, // For temperature
  CloudIcon, // For humidity
  BoltIcon, // For fans
  FireIcon, // For heat element
  PlayIcon, // For is_running
  StopIcon, // For is_running
  AdjustmentsHorizontalIcon, // For mode
} from "@heroicons/react/24/solid";
import { StatisticsCard } from "@/widgets/cards";
import Chart from "react-apexcharts"; // Import Chart directly
import { getSensorData, toggleDevice } from "@/services/esp32";
import { useMaterialTailwindController } from "@/context"; // Import useMaterialTailwindController
import { useEsp32 } from "@/context/esp32Context"; // Import useEsp32

export function Home() {
  const [controller] = useMaterialTailwindController(); // Get controller from context
  const { theme } = controller; // Destructure theme
  const { sendCommand } = useEsp32(); // Get sendCommand from Esp32Context
  const [dehydratorState, setDehydratorState] = useState({
    mode: "MANUAL",
    is_running: false,
    current_temp: 0.0,
    target_temp: 0.0,
    remaining_time: 0,
    fan_intake_state: false,
    fan_exhaust_state: false,
    fan_distributor_state: false,
    heater_state: false,
    humidity: 0.0, // Keep humidity for future updates
  });
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]); // Keep humidity history

  const MAX_HISTORY_POINTS = 60; // Store up to 5 minutes of data (60 points * 5 seconds/point)

  const fetchData = async () => {
    const data = await getSensorData();
    if (data) {
      setDehydratorState({
        mode: data.mode,
        is_running: data.is_running,
        current_temp: data.current_temp,
        target_temp: data.target_temp,
        remaining_time: data.remaining_time,
        fan_intake_state: data.fan_intake_state,
        fan_exhaust_state: data.fan_exhaust_state,
        fan_distributor_state: data.fan_distributor_state,
        heater_state: data.heater_state,
        humidity: data.humidity || 0.0, // Placeholder for future humidity data
      });

      const now = new Date().getTime(); // Use timestamp for datetime x-axis

      setTemperatureHistory((prevHistory) => {
        const newHistory = [...prevHistory, { x: now, y: data.current_temp }];
        return newHistory.slice(-MAX_HISTORY_POINTS);
      });

      setHumidityHistory((prevHistory) => {
        const newHistory = [...prevHistory, { x: now, y: data.humidity || 0.0 }];
        return newHistory.slice(-MAX_HISTORY_POINTS);
      });
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = (device) => {
    const newState = !dehydratorState[device]; // Calculate the new state
    toggleDevice(sendCommand, device, newState);
    // Optimistically update the state in the UI
    setDehydratorState((prevStates) => ({
      ...prevStates,
      [device]: newState,
    }));
  };

  const temperatureChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Temperature",
        data: temperatureHistory,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: 4,
        curve: "straight",
        lineCap: "round",
        colors: ["#800080"],
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          style: {
            colors: theme === "dark" ? "#e0e0e0" : "#37474f",
            fontSize: "13px",
            fontFamily: "inherit",
            fontWeight: 300,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: theme === "dark" ? "#e0e0e0" : "#37474f",
            fontSize: "13px",
            fontFamily: "inherit",
            fontWeight: 300,
          },
        },
      },
      tooltip: {
        x: {
          format: "HH:mm:ss",
        },
      },
    },
  };

  const humidityChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Humidity",
        data: humidityHistory,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: 4,
        curve: "straight",
        lineCap: "round",
        colors: ["#388e3c"],
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          style: {
            colors: theme === "dark" ? "#e0e0e0" : "#37474f",
            fontSize: "13px",
            fontFamily: "inherit",
            fontWeight: 300,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: theme === "dark" ? "#e0e0e0" : "#37474f",
            fontSize: "13px",
            fontFamily: "inherit",
            fontWeight: 300,
          },
        },
      },
      tooltip: {
        x: {
          format: "HH:mm:ss",
        },
      },
    },
  };

  return (
    <div className="mt-12 dark:bg-gray-900">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Sensor Data Cards */}
        <StatisticsCard
          title="Current Temperature"
          value={`${dehydratorState.current_temp.toFixed(2)} °C`}
          icon={React.createElement(SunIcon, {
            className: "w-6 h-6 text-white",
          })}
          color="blue"
          footer={
            <Typography className="font-normal text-blue-gray-600 dark:text-blue-gray-200">
              Current temperature
            </Typography>
          }
        />
        <StatisticsCard
          title="Humidity"
          value={`${dehydratorState.humidity.toFixed(2)} %`}
          icon={React.createElement(CloudIcon, {
            className: "w-6 h-6 text-white",
          })}
          color="green"
          footer={
            <Typography className="font-normal text-blue-gray-600 dark:text-blue-gray-200">
              Current humidity
            </Typography>
          }
        />
        <StatisticsCard
          title="Mode"
          value={dehydratorState.mode}
          icon={React.createElement(AdjustmentsHorizontalIcon, {
            className: "w-6 h-6 text-white",
          })}
          color="purple"
          footer={
            <Typography className="font-normal text-blue-gray-600 dark:text-blue-gray-200">
              Current operating mode
            </Typography>
          }
        />
        <StatisticsCard
          title="Is Running"
          value={dehydratorState.is_running ? "YES" : "NO"}
          icon={React.createElement(dehydratorState.is_running ? PlayIcon : StopIcon, {
            className: "w-6 h-6 text-white",
          })}
          color={dehydratorState.is_running ? "green" : "red"}
          footer={
            <Typography className="font-normal text-blue-gray-600 dark:text-blue-gray-200">
              Dehydrator operational status
            </Typography>
          }
        />
        <StatisticsCard
          title="Target Temperature"
          value={`${dehydratorState.target_temp.toFixed(2)} °C`}
          icon={React.createElement(InformationCircleIcon, {
            className: "w-6 h-6 text-white",
          })}
          color="orange"
          footer={
            <Typography className="font-normal text-blue-gray-600 dark:text-blue-gray-200">
              Target temperature in automatic mode
            </Typography>
          }
        />
        <StatisticsCard
          title="Remaining Time"
          value={`${dehydratorState.remaining_time} s`}
          icon={React.createElement(ClockIcon, {
            className: "w-6 h-6 text-white",
          })}
          color="teal"
          footer={
            <Typography className="font-normal text-blue-gray-600 dark:text-blue-gray-200">
              Remaining time in automatic mode
            </Typography>
          }
        />
      </div>



      {/* Historical Data Charts */}
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
        <div>
          <Typography variant="h6" color={theme === "dark" ? "white" : "blue-gray"}>
            Temperature History
          </Typography>
          <Chart
            options={temperatureChart.options}
            series={temperatureChart.series}
            type={temperatureChart.type}
            height={temperatureChart.height}
          />
        </div>
        <div>
          <Typography variant="h6" color={theme === "dark" ? "white" : "blue-gray"}>
            Humidity History
          </Typography>
          <Chart
            options={humidityChart.options}
            series={humidityChart.series}
            type={humidityChart.type}
            height={humidityChart.height}
          />
        </div>
      </div>

      {/* Removed Projects and Orders Overview sections */}
    </div>
  );
}

export default Home;
