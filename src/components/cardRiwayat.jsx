export default function CardRiwayat(props) {
  const {
    onCardClick,
    fotoAset,
    namaAset,
    unitAset,
    statusAset,
    durasiPinjam,
  } = props;
  return (
    <>
      <div
        className="flex gap-3 p-2 border cursor-pointer rounded-xl hover:bg-orange-50 hover:border-orange-300"
        onClick={onCardClick}
      >
        <img
          src={fotoAset}
          alt="Foto Aset"
          className="w-[110px] h-[110px] object-cover bg-gray-200 rounded-lg"
          loading="lazy"
        />
        <div>
          <div
            className={`badge badge-outline ${
              statusAset == "Menunggu Konfirmasi"
                ? "badge-primary"
                : statusAset == "Sedang Dipinjam"
                ? "badge-info"
                : statusAset == "Jatuh Tempo"
                ? "badge-secondary"
                : statusAset == "Selesai"
                ? "badge-success"
                : statusAset == "Dibatalkan"
                ? "badge-error"
                : statusAset == "Ditolak"
                ? "badge-error"
                : "badge-neutral"
            } `}
          >
            {statusAset}
          </div>
          <h3 className="mb-2 text-base font-semibold">{namaAset}</h3>
          <div className="flex items-center gap-1 mb-2">
            <img src="icon/gedung.svg" alt="icon" />
            <p className="text-sm">{unitAset}</p>
          </div>
          <p className="text-sm text-gray-500">{durasiPinjam}</p>
        </div>
      </div>
    </>
  );
}
