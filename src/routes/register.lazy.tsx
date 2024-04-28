import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import petImage2 from "../assets/pet-image-2.webp";
import { ChangeEvent, useState } from "react";

export const Route = createLazyFileRoute("/register")({
  component: About,
});

type RegisterUserProps = {
  name: string;
  address: string;
  contact_number: string;
  email: string;
  password: string;
  password_confirmation: string;
  gender: string;
  age: number;
};

function About() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    let base64String = "";
    reader.onload = async () => {
      base64String = reader.result as string;
      setImage(base64String);
    }
    reader.readAsDataURL(event.target!.files![0]);
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterUserProps>();

  const submit: SubmitHandler<RegisterUserProps> = async (data) => {
    fetch("https://qrcollarcompanion-api.onrender.com/v1/api/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
      body: JSON.stringify({
        name: data.name,
        address: data.address,
        contact_number: data.contact_number,
        email: data.email,
        password: data.password,
        gender: data.gender,
        age: data.age,
        image: image.replace(/^data:image\/[a-z]+;base64,/, ''),
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw data.errors;
        }

        return response.json();
      })
      .then(async (data) => {
        localStorage.setItem("access_token", data.access_token);
        navigate({ to: "/home" });
      })
      .catch((err) => {
        const errorKeys = Object.keys(err) as Array<keyof RegisterUserProps>;

        errorKeys.forEach((key) => {
          if (errors[key]) {
            setError(key, { message: err[key] });
          }
        });
      });
  };

  return (
    <div className="flex min-h-screen sm:items-center">
      <div className="m-auto w-full max-w-md">
        <div className="flex justify-center pt-12">
          <img src={petImage2} className="size-64" />
        </div>

        <form onSubmit={handleSubmit(submit)} className="p-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Full name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
              required
              autoFocus
            />
            {errors.name && <span className="mt-2 block text-sm text-red-600">{errors.name.message}</span>}
          </div>

          <div className="mt-4">
            <label htmlFor="address" className="mb-2 block text-sm font-medium">
              Address
            </label>
            <input
              {...register("address")}
              type="text"
              id="address"
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
              required
            />
            <span className="mt-1 block text-xs text-gray-500">
              Separate by commas (i.e. Emily Homes, Libertad, Butuan City)
            </span>
            {errors.address && (
              <span className="mt-2 block text-sm text-red-600">{errors.address.message}</span>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="contact_number" className="mb-2 block text-sm font-medium">
              Contact Number
            </label>
            <input
              {...register("contact_number")}
              type="text"
              id="contact_number"
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
              required
            />
            {errors.contact_number && (
              <span className="mt-2 block text-sm text-red-600">{errors.contact_number.message}</span>
            )}
          </div>

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
            />
            {errors.email && <span className="mt-2 block text-sm text-red-600">{errors.email.message}</span>}
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

          <div className="mt-4">
            <label htmlFor="gender" className="mb-2 block text-sm font-medium">
              Gender
            </label>
            <select
              {...register("gender")}
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
              name="gender"
              id="gender"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="age" className="mb-2 block text-sm font-medium">
              Age
            </label>
            <input
              {...register("age")}
              type="number"
              id="age"
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="image" className="mb-2 block text-sm font-medium">
              User Image
            </label>
            <input
              onChange={handleImageChange}
              type="file"
              name="image"
              id="image"
              accept="image/*"
              className="block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 focus:border-green-500 focus:ring-green-500
    disabled:pointer-events-none disabled:opacity-50"
              required
            />
          </div>

          <div className="mt-4 flex justify-between">
            <Link to="/" className="text-xs">
              Already have an account? <br />
              <span className="text-green-600 hover:text-green-700">Log in here</span>
            </Link>
            <button
              type="submit"
              className=" inline-flex items-center rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
