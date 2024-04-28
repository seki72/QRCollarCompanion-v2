import { ReactNode } from "react";
import destinations from "../destinations";

export default function NavigationRail({ header, children }: { header: JSX.Element; children: ReactNode }) {
  return (
    <div className="flex">
      <nav className="flex min-h-screen w-20 flex-col bg-green-700">
        <div className="justify-top fixed flex flex-grow flex-col items-center space-y-3.5 p-3">
          {destinations.map((Destination, index) => (
            <div key={index}>{Destination}</div>
          ))}
        </div>
      </nav>

      {header}

      <main className="mx-auto mt-20 w-full">{children}</main>
    </div>
  );
}
