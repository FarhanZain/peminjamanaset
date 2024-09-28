import { CiImageOff } from "react-icons/ci";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function CardBeranda(props) {
  const { fotoAset, namaAset, unitAset, statusAset, onCardClick } = props;

  return (
    <>
      <div
        className="flex gap-3 p-2 rounded-xl cursor-pointer border hover:bg-orange-50 hover:border-orange-300"
        onClick={onCardClick}
      >
        {!fotoAset ? (
          <div className="w-[97px] h-[97px] flex justify-center items-center bg-slate-100 rounded-lg">
            <CiImageOff size={32} />
          </div>
        ) : (
          <img
            src={fotoAset}
            alt="Foto Aset"
            className="w-[97px] h-[97px] object-cover bg-gray-200 rounded-lg"
            loading="lazy"
          />
        )}
        <div>
          <h3 className="text-base font-semibold mb-2">{namaAset}</h3>
          <div className="flex gap-1 items-center mb-2">
            <HiOutlineBuildingOffice2 className="text-orange-500" />
            <p className="text-sm">{unitAset}</p>
          </div>
          <div
            className={`badge badge-outline ${
              statusAset == "Tersedia" ? "badge-success" : "badge-error"
            } `}
          >
            {statusAset}
          </div>
        </div>
      </div>
    </>
  );
}
