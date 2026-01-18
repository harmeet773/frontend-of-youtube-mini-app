import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const IGNORED_ROUTES = [
  "/login",
  "/oauth-success"
];

export default function RouteTracker() {
  const location = useLocation();
  const prevPathRef = useRef(null);

  useEffect(() => {
    if (
      prevPathRef.current &&
      !IGNORED_ROUTES.includes(
        prevPathRef.current.split("?")[0]
      )
    ) {
      sessionStorage.setItem(
        "redirectAfterAuth",
        prevPathRef.current
      );
    }

    prevPathRef.current =
      location.pathname + location.search;
  }, [location.pathname, location.search]);

  return null;
}
