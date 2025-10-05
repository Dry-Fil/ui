import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useEsp32 } from "@/context/esp32Context";
import { Switch, Typography, Alert } from "@material-tailwind/react";
import { AutomaticMode } from "@/components/AutomaticMode";
import { ManualMode } from "@/components/ManualMode";
import { ComponentStatusIndicators } from "@/components/ComponentStatusIndicators";


export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { esp32State, isConnected, error, sendCommand } = useEsp32();

  const handleModeChange = (e) => {
    const newMode = e.target.checked ? "AUTOMATIC" : "MANUAL";
    sendCommand("SET_MODE", { mode: newMode });
  };

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar currentTemp={esp32State.current_temp} />

        {!isConnected && error && (
          <Alert color="red" className="mb-4">
            {error}
          </Alert>
        )}

        <div className="mb-4 flex items-center justify-between">
          <Typography variant="h6" color="blue-gray">
            Mode: {esp32State.mode}
          </Typography>
          <Switch
            id="mode-switch"
            label={esp32State.mode === "AUTOMATIC" ? "AUTOMATIC" : "MANUAL"}
            checked={esp32State.mode === "AUTOMATIC"}
            onChange={handleModeChange}
            color="lightBlue"
          />
        </div>

        <ComponentStatusIndicators />

        {esp32State.mode === "AUTOMATIC" ? (
          <AutomaticMode />
        ) : (
          <ManualMode />
        )}

        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} key={path} />
              ))
          )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
