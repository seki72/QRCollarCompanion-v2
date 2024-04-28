import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import HomeLayout from "../../layouts/home";
import Header from "../../components/header";
import { Link } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import ImageCrop from "../../components/image-crop";

export const Route = createLazyFileRoute("/_home/pets/create")({
  component: NewPet,
});

type NewPetProps = {
  pet_type: string;
  breed: string;
  name: string;
  age_in_years: number;
  age_in_months: number;
};

function validateAge(age: number): number {
  return age > 0 ? age : 0;
}

function NewPet() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [petImage, setPetImage] = useState<string | null>(null);
  const [showCropperModal, setShowCropperModal] = useState(false);

  function closeModal() {
    setShowCropperModal(false);
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NewPetProps>();

  const onSubmit: SubmitHandler<NewPetProps> = async (data) => {
    const JWT = localStorage.getItem("access_token");

    fetch("https://qrcollarcompanion-api.onrender.com/v1/api/pets", {
      method: "post",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pet_image: petImage ?? "",
        pet_type: data.pet_type,
        breed: data.breed,
        name: data.name,
        age: validateAge(data.age_in_years * 12 + +data.age_in_months),
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          return data.errors;
        }
        navigate({ to: "/pets" });
      })
      .catch((err) => {
        const errorKeys = Object.keys(err) as Array<keyof NewPetProps>;

        errorKeys.forEach((key) => {
          if (errors[key]) {
            setError(key, { message: err[key] });
          }
        });
      });
  };

  const onPetImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event?.target?.files[0]) {
      setPetImage(URL.createObjectURL(event?.target.files[0]));
    }
    setShowCropperModal(true);
  };

  return (
    <HomeLayout header={<Header title="New Pet" />}>
      <div className="max-w-xl p-4 text-gray-800 sm:p-6">
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

        <div className="mt-4 flex justify-center">
          <canvas ref={canvasRef} className="h-[300px] w-[300px] rounded-full bg-gray-200"></canvas>
        </div>

        {petImage && (
          <ImageCrop
            image={petImage}
            setImage={setPetImage}
            canvas={canvasRef.current!}
            show={showCropperModal}
            closeModal={closeModal}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-6">
            <div>
              <label htmlFor="image" className="mb-2 block text-sm font-medium">
                Pet image
              </label>
              <input
                onChange={onPetImageChange}
                onClick={(e) => ((e.target as HTMLInputElement).value = "")}
                type="file"
                name="image"
                id="image"
                accept="image/*"
                className="block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 focus:ring-green-500 active:border-green-600 disabled:pointer-events-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="type" className="mb-2 block text-sm font-medium">
              Type
            </label>
            <select
              {...register("pet_type")}
              id="type"
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
            >
              <option value="cat">Cat</option>
              <option value="dog">Dog</option>
            </select>
            {errors.pet_type && (
              <span className="mt-2 block text-sm text-red-600">{errors.pet_type.message}</span>
            )}
          </div>
          <div className="mt-6">
            <label htmlFor="breed" className="mb-2 block text-sm font-medium">
              Breed (optional)
            </label>
            <input
              {...register("breed")}
              type="text"
              id="breed"
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
            />
            {errors.breed && <span className="mt-2 block text-sm text-red-600">{errors.breed.message}</span>}
          </div>
          <div className="mt-6">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
              required
            />
            {errors.name && <span className="mt-2 block text-sm text-red-600">{errors.name.message}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mt-6">
              <label htmlFor="age_in_years" className="mb-2 block text-sm font-medium">
                Age (in years)
              </label>
              <input
                {...register("age_in_years")}
                type="text"
                id="age_in_years"
                className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
              />
              {errors.age_in_years && (
                <span className="mt-2 block text-sm text-red-600">{errors.age_in_years.message}</span>
              )}
            </div>
            <div className="mt-6">
              <label htmlFor="age_in_months" className="mb-2 block text-sm font-medium">
                Age (in months)
              </label>
              <input
                {...register("age_in_months")}
                type="text"
                id="age_in_months"
                className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
}
