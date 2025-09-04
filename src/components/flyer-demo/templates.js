"use client";

import { useRouter } from "next/navigation";
import { Loader, Trash2 } from "lucide-react";
import { deleteDesign, getUserDesigns } from "@/services/design-service";
import { useEditorStore } from "@/store";
import DesignPreview from "../home/design-preview";

function DesignList({
  listOfDesigns,
  isLoading,
  isModalView,
  setShowDesignsModal,
  onClickFun,
  active,
}) {
  const router = useRouter();
  const { setUserDesigns } = useEditorStore();

  async function fetchUserDesigns() {
    const result = await getUserDesigns();

    if (result?.success) setUserDesigns(result?.data);
  }

  const handleDeleteDesign = async (getCurrentDesignId) => {
    const response = await deleteDesign(getCurrentDesignId);

    if (response.success) {
      fetchUserDesigns();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div
      className={`${
        isModalView ? "p-4" : ""
      } grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4`}
    >
      {!listOfDesigns.length && <h1>No Design Found!</h1>}
      {listOfDesigns.map((design) => (
        <div
          onClick={() => onClickFun(design._id)}
          key={design._id}
          className={`group p-4 ${
            active === design._id && "border-2 rounded-2xl border-black"
          } ${onClickFun && "cursor-pointer"} `}
        >
          <div className="w-full h-[300px] rounded-lg mb-2 overflow-hidden transition-shadow group-hover:shadow-md">
            {design?.canvasData && (
              <DesignPreview key={design._id} design={design} />
            )}
          </div>
          <div className="flex justify-between">
            <p className="font-bold text-sm truncate">{design.name}</p>
            <Trash2
              onClick={() => handleDeleteDesign(design?._id)}
              className="w-5 h-5 "
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default DesignList;
