import { Routes, Route } from "react-router-dom";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context"; // Import useMaterialTailwindController

export function Auth() {
  const [controller] = useMaterialTailwindController(); // Get controller
  const { theme } = controller; // Get theme from controller
  const isDarkMode = theme === "dark"; // Determine if dark mode is active

  return (
    <div className={`relative min-h-screen w-full ${isDarkMode ? "dark:bg-gray-900" : "bg-white"}`}> {/* Apply dark mode background */}
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
