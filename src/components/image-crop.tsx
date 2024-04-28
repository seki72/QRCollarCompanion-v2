import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const aspectRatio = 1;

export default function ImageCrop({
  image,
  setImage,
  canvas,
  show,
  closeModal,
}: {
  image?: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  canvas: HTMLCanvasElement;
  show: boolean;
  closeModal: () => void;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();

  function onImageLoad(event: React.SyntheticEvent<HTMLImageElement, Event>) {
    const { width, height } = event.currentTarget;
    const crop = makeAspectCrop(
      {
        unit: "px",
        width: 300,
      },
      1,
      width,
      height,
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  }

  function cropImage() {
    const image = imageRef.current!;
    const ctx = canvas.getContext("2d");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop!.width;
    canvas.height = crop!.height;

    ctx!.drawImage(
      image,
      crop!.x * scaleX,
      crop!.y * scaleY,
      crop!.width * scaleX,
      crop!.height * scaleY,
      0,
      0,
      crop!.width,
      crop!.height,
    );

    const base64Image = canvas.toDataURL("image/jpeg").split(";base64,")[1];
    setImage(base64Image);
    closeModal();
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white px-6 pb-4 pt-8 align-middle transition-all">
                <div className="m-auto h-3/4 w-3/4">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    aspect={aspectRatio}
                    circularCrop
                    locked
                  >
                    <img ref={imageRef} src={image!} onLoad={onImageLoad} className="bg-contain" />
                  </ReactCrop>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={closeModal}
                    type="button"
                    className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={cropImage}
                    type="button"
                    className="ms-3 inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Done
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
