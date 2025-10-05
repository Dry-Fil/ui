import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController } from "@/context";

export function Footer({ brandName, brandLink, routes }) {
  const [controller] = useMaterialTailwindController();
  const { theme } = controller;
  const year = new Date().getFullYear();

  const isDarkMode = theme === "dark";

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className={`font-normal ${isDarkMode ? "text-blue-gray-200" : "text-inherit"}`}>
          &copy; {year}, made with{" "}
          <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" /> by{" "}
          <a
            href={brandLink}
            target="_blank"
            className="transition-colors hover:text-blue-500 font-bold"
          >
            {brandName}
          </a>{" "}
          for a better web.
        </Typography>
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                variant="small"
                className={`py-0.5 px-1 font-normal ${isDarkMode ? "text-blue-gray-200" : "text-inherit"} transition-colors hover:text-blue-500`}
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandName: "DryFil",
  brandLink: "#",
  routes: [
    { name: "", path: "#" },
  ],
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
