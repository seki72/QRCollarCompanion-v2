import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import HomeLayout from "../../layouts/home";

export const Route = createLazyFileRoute("/_home/pets/")({
  component: Pets,
});

function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      const JWT = localStorage.getItem("access_token");

      const response = await fetch("https://qrcollarcompanion-api.onrender.com/v1/api/pets", {
        method: "get",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      });
      const data = await response.json();
      setPets(data.pets);
    };

    fetchPets();
  }, []);

  return (
    <HomeLayout header={<Header title="My Pets" />}>
      <div className="max-w-xl space-y-4 p-4 sm:p-6">
        <div className="flex justify-end">
          <Link
            to="/pets/create"
            className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 active:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            Add new pet
          </Link>
        </div>

        {pets.length == 0 && <p className="text-sm text-gray-800">You don't have any pets yet.</p>}

        {pets.map((pet) => (
          <Link
            key={pet.uuid}
            to="/pets/$uuid"
            params={{ uuid: pet.uuid }}
            className="block"
          >
            <div className="flex cursor-pointer justify-between rounded border border-gray-200 bg-white p-4 text-gray-800 hover:bg-gray-100 active:bg-gray-100">
              {pet.name}

              {pet.pet_type === "cat" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-no-shrink size-6"
                >
                  <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
                  <path d="M8 14v.5" />
                  <path d="M16 14v.5" />
                  <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
                </svg>
              )}

              {pet.pet_type === "dog" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6 flex-shrink-0"
                >
                  <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
                  <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
                  <path d="M8 14v.5" />
                  <path d="M16 14v.5" />
                  <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
                  <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
                </svg>
              )}
            </div>
          </Link>
        ))}
      </div>
    </HomeLayout>
  );
}
