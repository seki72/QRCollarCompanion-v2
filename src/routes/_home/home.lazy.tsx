import { createLazyFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import HomeLayout from "../../layouts/home";

export const Route = createLazyFileRoute("/_home/home")({
  component: Home,
});

type Notification = {
  id: number;
  pet: Pet;
  created_at: string;
  latitude: number;
  longitude: number;
  message?: string;
};

function Home() {
  const [pets, setPets] = useState<Pet[] | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem("access_token");

    const fetchPets = async () => {
      const response = await fetch("https://qrcollarcompanion-api.onrender.com/api/v1/pets", {
        headers: {
          Authorization: `Bearer ${jwt}`,
          mode: "cors",
        },
      });
      const data = await response.json();

      setPets(data.pets);
    };

    const fetchNotifications = async () => {
      const response = await fetch("https://qrcollarcompanion-api.onrender.com/api/v1/notifications", {
        method: "get",
        headers: {
          Authorization: `Bearer ${jwt}`,
          mode: "cors",
        },
      });
      const data = await response.json();

      setNotifications(data.notifications);
    };

    fetchPets();
    fetchNotifications();
  }, []);

  function viewAddress(notification: Notification) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${notification.latitude},${notification.longitude}`,
        );
      },
      () => {},
      { enableHighAccuracy: true },
    );
  }

  return (
    <HomeLayout header={<Header title="Dashboard" />}>
      <div className="space-y-4 p-4 sm:p-6">
        <div className="col-span-2 space-y-2 rounded bg-green-700 p-4 text-white shadow-sm sm:max-w-md">
          <p className="text-2xl font-medium leading-tight">My Pets</p>
          <p className="text-xl">{pets?.length}</p>
        </div>

        <div className="max-w-md grow rounded border border-gray-200 bg-white p-4 text-gray-800 shadow-sm">
          <div className="text-lg font-medium leading-tight">Notifications</div>
        </div>

        <ul className="mt-3 space-y-3">
          {notifications?.reverse().map((notification) => (
            <div
              className="flex max-w-md items-center justify-between rounded border border-gray-200 bg-white p-4 text-sm text-gray-800"
              key={crypto.randomUUID()}
            >
              <div>
                <strong>{notification.pet.name}</strong> was scanned at{" "}
                <strong>{format(notification.created_at, "MMM dd, yyyy 'at' hh:mm a")}</strong>
                {notification.message && <strong>notification.message</strong>}
              </div>
              <div>
                <button onClick={() => viewAddress(notification)} type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-10 rounded bg-green-600 p-2 text-white transition-all duration-200 ease-in-out hover:bg-green-700 hover:text-white active:bg-green-700 active:text-white"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </HomeLayout>
  );
}
