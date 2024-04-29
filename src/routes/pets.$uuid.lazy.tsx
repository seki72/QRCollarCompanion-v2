import { Dialog, Transition } from "@headlessui/react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import QRModal from "../components/qr-modal";

export const Route = createFileRoute("/pets/$uuid")({
  component: Pet,
});

function parseAge(age: number) {
  if (age == 0) {
    return "N/A";
  }

  const ageInYears = Math.floor(age / 12);
  const ageInMonths = age % 12;

  return `${ageInYears} years & ${ageInMonths} months old`;
}

function Pet() {
  const { uuid } = Route.useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jwt, setJWT] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const getJWT = async () => {
      const JWT = localStorage.getItem("access_token");
      setJWT(JWT);
    };

    getJWT();
  }, []);

  useEffect(() => {
    const fetchPet = async () => {
      const JWT = localStorage.getItem("access_token");
      const response = await fetch(`https://qrcollarcompanion-api.onrender.com/api/v1/pets/${uuid}`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${JWT}`,
          mode: "cors",
        },
      });
      const data = await response.json();
      setPet(data.pet);
    };

    fetchPet();
  }, []);

  function closeQRModal() {
    setShowQRModal(false);
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
  }

  function deletePet() {
    fetch(`https://qrcollarcompanion-api.onrender.com/api/v1/pets/${uuid}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${jwt}`,
        mode: "cors",
      },
    }).then((response) => {
      if (response.ok) {
        navigate({ to: "/pets" });
      }
    });
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showMessage) {
      timer = setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showMessage]);

  function notifyOwner() {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      fetch(`https://qrcollarcompanion-api.onrender.com/api/v1/pets/${uuid}/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
        body: JSON.stringify({
          longitude: longitude,
          latitude: latitude,
        }),
      }).then((response) => {
        if (!response.ok) {
          return;
        }

        setShowMessage(true);
      });
    },
      () => { },
      { enableHighAccuracy: true });
  }

  return (
    <>
      <div className="max-w-xl p-4 sm:p-6">
        {jwt && (
          <Link
            to={"/pets"}
            className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 active:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
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
              className="flex-shrink-none size-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m14 16-4-4 4-4" />
            </svg>
            Back
          </Link>
        )}

        {/* Display pet image */}
        <div className="flex justify-center">
          {pet && <img src={`data:image/png;base64,${pet?.pet_image}`} alt="" className="rounded-full" />}
        </div>

        <div className="mt-4 rounded border border-gray-200 bg-white p-4 text-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium leading-tight">Pet Name: {pet?.name} </h1>
            <div className="inline-flex gap-x-1">
              {/* SHOW PET QR */}
              {jwt && (
                <button onClick={() => setShowQRModal(true)}>
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
                    className="size-10 rounded bg-green-600 p-2 text-white transition-all duration-200 ease-in-out hover:bg-green-700 hover:text-white active:bg-green-700 active:text-white"
                  >
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                    <path d="M21 21v.01" />
                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                    <path d="M3 12h.01" />
                    <path d="M12 3h.01" />
                    <path d="M12 16v.01" />
                    <path d="M16 12h1" />
                    <path d="M21 12v.01" />
                    <path d="M12 21v-1" />
                  </svg>
                </button>
              )}

              {/* SHOW OWNER ADDRESS VIA GOOGLE MAPS */}
              <a
                target="_blank"
                href={`https://www.google.com/maps/search/?api=1&query=${pet?.owner?.address.replace(/ /g, "+")}`}
              >
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
              </a>
            </div>
          </div>

          {/* Display pet information */}
          <div className="text-sm">
            <p>Breed: {pet?.breed ? pet!.breed : "N/A"}</p>
            <p>Age: {pet?.age ? parseAge(pet!.age as number) : "N/A"}</p>
          </div>
        </div>

        {/* Owner Information */}
        {pet?.owner && (
          <div className="mt-6 flex justify-center">
            <img
              src={`data:image/jpeg;base64,${pet?.owner?.image}`}
              alt=""
              className="aspect-square rounded-full object-cover"
              width="200"
              height="200"
            />
          </div>
        )}
        <div className="mt-4 rounded border border-gray-200 bg-white p-4 text-gray-800">
          <h2 className="text-lg font-medium leading-tight">
            Owner name: {pet?.owner ? pet.owner.name : ""}{" "}
          </h2>

          <div className="mt-1 text-sm">
            <p>Email address: {pet?.owner ? pet.owner.email : ""}</p>
            <p>Physical address: {pet?.owner ? pet.owner.address : ""}</p>
            <p>Contact number: {pet?.owner ? pet.owner.contact_number : ""}</p>
            <p>Age: {pet?.owner ? pet.owner.age : ""}</p>
            <p>Gender: {pet?.owner ? pet.owner.gender : ""}</p>
            {!jwt && (
              <div className="mt-2 flex items-center justify-end">
                <div
                  className={`transition-opacity duration-300 ${showMessage ? "opacity-100" : "opacity-0"}`}
                >
                  <p>Notified owner!</p>
                </div>
                <button
                  onClick={notifyOwner}
                  className="ml-3 rounded bg-green-600 p-2 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:bg-green-700 hover:text-white active:bg-green-700 active:text-white"
                >
                  Notify Owner
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete pet */}
        {jwt && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowDeleteModal(true)}
              type="button"
              className="ms-3 inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 active:bg-red-700 disabled:pointer-events-none disabled:opacity-50"
            >
              Delete pet
            </button>
          </div>
        )}
      </div>

      <QRModal isOpen={showQRModal} closeModal={closeQRModal} />

      {/* Modal to confirm delete */}
      <Transition appear show={showDeleteModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this pet? <br />
                      This action is irreversible.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="focus-visible:ring-2focus-visible:ring-offset-2 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      onClick={deletePet}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
