import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";

export function DashboardNavbar({ currentTemp }) { // Accept currentTemp as a prop
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav, theme } = controller; // Get theme from controller
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const isDarkMode = theme === "dark";

  return (
    <Navbar
      color={fixedNavbar ? (isDarkMode ? "gray-800" : "white") : "transparent"} // Adjust Navbar color based on theme
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      } ${isDarkMode ? "dark:bg-gray-900 dark:text-white" : ""}`} // Add dark mode classes
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color={isDarkMode ? "white" : "blue-gray"} // Adjust Typography color
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color={isDarkMode ? "white" : "blue-gray"} // Adjust Typography color
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color={isDarkMode ? "white" : "blue-gray"}> {/* Adjust Typography color */}
            {page}
          </Typography>
        </div>
        <div className="flex items-center gap-4">
          <Typography variant="h6" color={isDarkMode ? "white" : "blue-gray"} className="font-bold"> {/* Adjust Typography color */}
            Temp: {currentTemp}°C
          </Typography>
          <IconButton
            variant="text"
            color={isDarkMode ? "white" : "blue-gray"} // Adjust IconButton color
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className={isDarkMode ? "h-6 w-6 text-white" : "h-6 w-6 text-blue-gray-500"} /> {/* Adjust icon color */}
          </IconButton>
          <Link to="/auth/sign-in">
            <Button
              variant="text"
              color={isDarkMode ? "white" : "blue-gray"} // Adjust Button color
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
            >
              <UserCircleIcon className={isDarkMode ? "h-5 w-5 text-white" : "h-5 w-5 text-blue-gray-500"} /> {/* Adjust icon color */}
              Sign In
            </Button>
            <IconButton
              variant="text"
              color={isDarkMode ? "white" : "blue-gray"} // Adjust IconButton color
              className="grid xl:hidden"
            >
              <UserCircleIcon className={isDarkMode ? "h-5 w-5 text-white" : "h-5 w-5 text-blue-gray-500"} /> {/* Adjust icon color */}
            </IconButton>
          </Link>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
