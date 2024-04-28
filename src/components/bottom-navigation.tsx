import { ReactNode } from "react";
import destinations from "../destinations";

export default function BottomNavigation({ header, children }: { header: JSX.Element; children: ReactNode }) {
  return (
    <>
      {header}

      <main className="mb-20 mt-10 min-h-screen overflow-y-auto">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 flex h-20 items-center justify-between bg-green-700 px-4 pb-4 pt-3">
        {destinations.map((Destination, index) => (
          <div key={index}>{Destination}</div>
        ))}
      </nav>
    </>
  );
}
