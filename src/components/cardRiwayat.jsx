import { BiCategoryAlt } from "react-icons/bi";
import { CiImageOff } from "react-icons/ci";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function CardRiwayat(props) {
  const {
    onCardClick,
    fotoAset,
    namaAset,
    unitAset,
    kategoriAset,
    statusAset,
    tglMulai,
    tglSelesai,
  } = props;
  return (
    <>
      <div
        className="flex gap-3 p-2 border cursor-pointer rounded-xl hover:bg-orange-50 hover:border-orange-300"
        onClick={onCardClick}
      >
        {!fotoAset ? (
          <div className="w-[110px] h-[110px] flex justify-center items-center bg-slate-100 rounded-lg">
            <CiImageOff size={32} />
          </div>
        ) : (
          <img
            src={fotoAset}
            alt="Foto Aset"
            className="w-[110px] h-[110px] object-cover bg-gray-200 rounded-lg"
            loading="lazy"
          />
        )}
        <div>
          <div
            className={`badge badge-outline mb-1 ${
              statusAset == "Menunggu Konfirmasi"
                ? "badge-primary"
                : statusAset == "Disetujui"
                ? "badge-info"
                : statusAset == "Jatuh Tempo"
                ? "badge-secondary"
                : statusAset == "Selesai"
                ? "badge-success"
                : statusAset == "Dibatalkan"
                ? "badge-error"
                : statusAset == "Ditolak"
                ? "badge-error"
                : statusAset == "Bermasalah"
                ? "badge-error"
                : "badge-neutral"
            } `}
          >
            {statusAset}
          </div>
          <h3 className="mb-2 text-base font-semibold">{namaAset}</h3>
          <div className="flex gap-3">
            <div className="flex items-center gap-1 mb-2">
              <HiOutlineBuildingOffice2 className="text-orange-500" />
              <p className="text-sm">{unitAset}</p>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <BiCategoryAlt className="text-orange-500" />
              <p className="text-sm">{kategoriAset}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {tglMulai} - {tglSelesai}
          </p>
        </div>
      </div>
    </>
  );
}
