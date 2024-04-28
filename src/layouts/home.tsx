import { ReactNode, useEffect, useState } from "react";
import BottomNavigation from "../components/bottom-navigation";
import NavigationRail from "../components/navigation-rail";

export default function HomeLayout({ header, children }: { header: JSX.Element; children?: ReactNode }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  return window.innerWidth > 640 ? (
    <NavigationRail header={header}>{children}</NavigationRail>
  ) : (
    <BottomNavigation header={header}>{children}</BottomNavigation>
  );
}
