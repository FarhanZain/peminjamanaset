import Modal from "./modal";

export default function CardRiwayat(props) {
  const { fotoAset, namaAset, unitAset, statusAset, durasiPinjam } = props;
  return (
    <>
      <div
        className="flex gap-3 p-2 border cursor-pointer rounded-xl hover:bg-orange-50 hover:border-orange-300"
        onClick={() => document.getElementById("detailAsset").showModal()}
      >
        <img
          src={fotoAset}
          alt="Foto Aset"
          className="w-[110px] h-[110px] object-cover bg-gray-200 rounded-lg"
          loading="lazy"
        />
        <div>
          <div className="mb-2 badge badge-outline badge-success">
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
      <Modal id={"detailAsset"} title={"Detail"}>
        <img
          src="image/speaker.jpg"
          alt="Foto Aset"
          className="w-full h-[200px] lg:h-[300px] object-contain bg-gray-200 rounded-2xl my-3"
          loading="lazy"
        />
        <h3 className="mb-3 text-xl font-bold">Kamera Mirrorless</h3>
        <div className="flex items-center gap-1 mb-3">
          <img src="icon/nomoraset.svg" alt="icon" />
          <p className="text-sm">UA123456</p>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <img src="icon/gedung.svg" alt="icon" />
          <p className="text-sm">Unit Yayasan</p>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <img src="icon/lokasi.svg" alt="icon" />
          <p className="text-sm">Kantor Yayasan</p>
        </div>
        <div className="mb-4 badge badge-outline badge-success">Tersedia</div>
        <button
          type="button"
          className="w-full text-white bg-orange-500 btn hover:bg-orange-600"
          onClick={() => document.getElementById("formPinjam").showModal()}
        >
          Pinjam
        </button>
      </Modal>
      <Modal id={"formPinjam"} title={"Formulir Peminjaman"}>
        <p>Ini Form Peminjman</p>
      </Modal>
    </>
  );
}
