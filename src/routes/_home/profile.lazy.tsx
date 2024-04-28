import { Dialog, Transition } from "@headlessui/react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Header from "../../components/header";
import HomeLayout from "../../layouts/home";

export const Route = createLazyFileRoute("/_home/profile")({
  component: Profile,
});

type ChangeProfileProps = {
  name: string;
  address: string;
  contact_number: string;
  email: string;
};

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Owner | null>(null);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function closeDeleteModal() {
    setShowDeleteModal(false);
  }

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangeProfileProps>();

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate({ to: "/" });
  };

  const fetchUser = async () => {
    const jwt = localStorage.getItem("access_token");

    await fetch("https://qrcollarcompanion-api.onrender.com/api/v1/user", {
      method: "get",
      headers: {
        Authorization: `Bearer ${jwt}`,
        mode: "cors",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw data.errors;
        }

        return response.json();
      })
      .then((data) => {
        setUser(data.current_user);
        reset();
      })
      .catch((err) => {
        const errorKeys = Object.keys(err) as Array<keyof ChangeProfileProps>;

        errorKeys.forEach((key) => {
          if (errors[key]) {
            setError(key, { message: err[key] });
          }
        });
      });
  };

  const submit: SubmitHandler<ChangeProfileProps> = async (data) => {
    const jwt = localStorage.getItem("access_token");

    await fetch("https://qrcollarcompanion-api.onrender.com/api/v1/user", {
      method: "put",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
        mode: "cors",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw data.errors;
        }

        setRecentlySuccessful(true);

        setTimeout(() => {
          setRecentlySuccessful(false);
        }, 1000);

        fetchUser();
      })
      .catch((err) => {
        const errorKeys = Object.keys(err) as Array<keyof ChangeProfileProps>;

        errorKeys.forEach((key) => {
          if (errors[key]) {
            setError(key, { message: err[key] });
          }
        });
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const deleteUser = async () => {
    const jwt = localStorage.getItem("access_token");

    await fetch("https://qrcollarcompanion-api.onrender.com/api/v1/user", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
        mode: "cors",
      },
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      logout();
    });
  };

  return (
    <HomeLayout header={<Header title="Profile" />}>
      <form onSubmit={handleSubmit(submit)} className="space-y-6 p-4 sm:max-w-xl sm:p-6">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            {...register("name", { value: user?.name })}
            type="text"
            id="name"
            className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
            required
            autoFocus
          />
          {errors.name && <span className="mt-2 block text-sm text-red-600">{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            {...register("email", { value: user?.email })}
            type="email"
            id="email"
            className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
            required
            autoComplete="email"
          />
          {errors.email && <span className="mt-2 block text-sm text-red-600">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Address
          </label>
          <input
            {...register("address", { value: user?.address })}
            type="text"
            id="address"
            className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
            required
          />
          {errors.address && (
            <span className="mt-2 block text-sm text-red-600">{errors.address.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="contact_number" className="mb-2 block text-sm font-medium">
            Contact number
          </label>
          <input
            {...register("contact_number", { value: user?.contact_number })}
            type="text"
            id="contact_number"
            className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
            required
          />
          {errors.contact_number && (
            <span className="mt-2 block text-sm text-red-600">{errors.contact_number.message}</span>
          )}
        </div>

        <div className="flex items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete Account
          </button>

          <div>
            <button
              onClick={logout}
              type="button"
              className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              Log out
            </button>
            <button
              type="submit"
              className="ms-3 inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
            >
              Update profile
            </button>
            <Transition
              show={recentlySuccessful}
              enter="transition ease-in-out"
              enterFrom="opacity-0"
              leave="transition ease-in-out"
              leaveTo="opacity-0"
            >
              <p className="ms-3 text-sm text-gray-600">Saved.</p>
            </Transition>
          </div>
        </div>
      </form>

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
                      Are you sure you want to delete your account? <br />
                      This action is irreversible.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={deleteUser}
                      className="focus-visible:ring-2focus-visible:ring-offset-2 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
    </HomeLayout>
  );
}
