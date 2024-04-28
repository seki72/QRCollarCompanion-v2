import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import petImage1 from "../assets/pet-image-1.webp";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

type LoginFormProps = {
  email: string;
  password: string;
};

function Index() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormProps>();

  const onSubmit: SubmitHandler<LoginFormProps> = async (data) => {
    fetch("/api/v1/login", {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
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
        localStorage.setItem("access_token", data.access_token);
        navigate({ to: "/home" });
      })
      .catch((errors) => {
        setError("email", {
          message: errors.email,
        });
      });
  };

  return (
    <div className="flex min-h-screen items-center">
      <div className="m-auto w-full max-w-md">
        <div className="flex justify-center">
          <img src={petImage1} className="size-64" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {errors?.email && (
            <div
              className="mt-2 rounded-lg border border-red-200 bg-red-100 p-4 text-sm text-red-800"
              role="alert"
            >
              {errors?.email.message}
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
              required
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Link to="/register" className="text-xs">
              Don't have an account?{" "}
              <span className="text-green-600 hover:text-green-700">Register here</span>
            </Link>

            <button
              type="submit"
              className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
