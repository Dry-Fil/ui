import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { useMaterialTailwindController } from "@/context";

export function StatisticsChart({ color, chart, title, description, footer }) {
  const [controller] = useMaterialTailwindController();
  const { theme } = controller;

  return (
    <Card className={`border shadow-sm ${theme === "dark" ? "dark:bg-gray-800 dark:border-blue-gray-800" : "border-blue-gray-100"}`}>
      <CardHeader variant="gradient" color={color} floated={false} shadow={false}>
        <Chart {...chart} />
      </CardHeader>
      <CardBody className="px-6 pt-0">
        <Typography variant="h6" color={theme === "dark" ? "white" : "blue-gray"}>
          {title}
        </Typography>
        <Typography variant="small" className={`font-normal ${theme === "dark" ? "text-blue-gray-200" : "text-blue-gray-600"}`}>
          {description}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className={`border-t px-6 py-5 ${theme === "dark" ? "border-blue-gray-800" : "border-blue-gray-50"}`}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsChart.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsChart.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  chart: PropTypes.object.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsChart.displayName = "/src/widgets/charts/statistics-chart.jsx";

export default StatisticsChart;
