import { useState } from "react";
import Modal from "./modal";

export default function CardBeranda(props) {
  const { fotoAset, namaAset, unitAset, statusAset } = props;

  const [tglMulai, setTglMulai] = useState("");
  const [tglSelesai, setTglSelesai] = useState("");
  const [alasanKeperluan, setAlsnKeperluan] = useState("");
  const [blankTglMulai, setBlankTglMulai] = useState("");
  const [blankTglSelesai, setBlankTglSelesai] = useState("");
  const [blankAlsnKeperluan, setBlankAlsnKeperluan] = useState("");

  const handleSubmitForm = (event) => {
    event.preventDefault();
    if (!tglMulai) {
      setBlankTglMulai("Silahkan masukkan tanggal mulai !");
    } else {
      setBlankTglMulai("");
    }
    if (!tglSelesai) {
      setBlankTglSelesai("Silahkan masukkan tanggal selesai !");
    } else {
      setBlankTglSelesai("");
    }
    if (!alasanKeperluan) {
      setBlankAlsnKeperluan("Silahkan masukkan alasan keperluan !");
    } else {
      setBlankAlsnKeperluan("");
    }
    if (tglMulai && tglSelesai && alasanKeperluan) {
      // document.getElementById("formPinjam").close();
      event.target.submit();
    }
  };

  return (
    <>
      <div
        className="flex gap-3 p-2 rounded-xl cursor-pointer border hover:bg-orange-50 hover:border-orange-300"
        onClick={() => document.getElementById("detailAsset").showModal()}
      >
        <img
          src={fotoAset}
          alt="Foto Aset"
          className="w-[97px] h-[97px] object-cover bg-gray-200 rounded-lg"
          loading="lazy"
        />
        <div>
          <h3 className="text-base font-semibold mb-2">{namaAset}</h3>
          <div className="flex gap-1 items-center mb-2">
            <img src="icon/gedung.svg" alt="icon" />
            <p className="text-sm">{unitAset}</p>
          </div>
          <div className="badge badge-outline badge-success">{statusAset}</div>
        </div>
      </div>
      <Modal id={"detailAsset"} title={"Detail"}>
        <img
          src="image/speaker.jpg"
          alt="Foto Aset"
          className="w-full h-[200px] lg:h-[300px] object-contain bg-gray-200 rounded-2xl my-3"
          loading="lazy"
        />
        <h3 className="text-xl font-bold mb-3">Kamera Mirrorless</h3>
        <div className="flex gap-1 items-center mb-3">
          <img src="icon/nomoraset.svg" alt="icon" />
          <p className="text-sm">UA123456</p>
        </div>
        <div className="flex gap-1 items-center mb-3">
          <img src="icon/gedung.svg" alt="icon" />
          <p className="text-sm">Unit Yayasan</p>
        </div>
        <div className="flex gap-1 items-center mb-3">
          <img src="icon/lokasi.svg" alt="icon" />
          <p className="text-sm">Kantor Yayasan</p>
        </div>
        <div className="badge badge-outline badge-success mb-4">Tersedia</div>
        <button
          type="button"
          className="btn w-full text-white bg-orange-500 hover:bg-orange-600"
          onClick={() => document.getElementById("formPinjam").showModal()}
        >
          Pinjam
        </button>
      </Modal>
      <Modal id={"formPinjam"} title={"Formulir Peminjaman"}>
        <form action="" className="my-3" onSubmit={handleSubmitForm}>
          {/* Nomor Aset always disabled */}
          <label className="form-control w-full mb-4">
            <span className="mb-1 text-sm lg:text-base">No Aset</span>
            <input
              type="text"
              placeholder="No Aset"
              className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
              value="UA12345678"
              disabled
            />
          </label>
          {/* Nama always disabled */}
          <label className="form-control w-full mb-4">
            <span className="mb-1 text-sm lg:text-base">Nama</span>
            <input
              type="text"
              placeholder="Masukkan Nama"
              className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
              value="Farhan Abdurrahman Zain"
              disabled
            />
          </label>
          {/* No HP always disabled */}
          <label className="form-control w-full mb-4">
            <span className="mb-1 text-sm lg:text-base">No HP</span>
            <input
              type="text"
              placeholder="No HP"
              className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
              value="081234567890"
              disabled
            />
          </label>
          {/* Alamat always disabled */}
          <label className="form-control w-full mb-4">
            <span className="mb-1 text-sm lg:text-base">Alamat</span>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Alamat"
              disabled
            >
              Perumahan Mekarsari blok D.100 tiban lama, sekupang, Batam
            </textarea>
          </label>
          {/* Tanggal mulai dan selesai */}
          <div className="flex gap-4">
            {/* Tanggal Mulai */}
            <label className="form-control w-full mb-4">
              <span className="mb-1 text-sm lg:text-base">Tanggal Mulai</span>
              <input
                type="date"
                placeholder="Tanggal Mulai"
                className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
                value=""
                onChange={(e) => setTglMulai(e.target.value)}
              />
              {/* Error message */}
              {blankTglMulai && (
                <p className="text-red-500 mt-1">{blankTglMulai}</p>
              )}
            </label>
            {/* Tanggal Selesai */}
            <label className="form-control w-full mb-4">
              <span className="mb-1 text-sm lg:text-base">Tanggal Selesai</span>
              <input
                type="date"
                placeholder="Tanggal Selesai"
                className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
                value=""
                onChange={(e) => setTglSelesai(e.target.value)}
              />
              {/* Error message */}
              {blankTglSelesai && (
                <p className="text-red-500 mt-1">{blankTglSelesai}</p>
              )}
            </label>
          </div>
          {/* Alasan Keperluan always disabled */}
          <label className="form-control w-full mb-4">
            <span className="mb-1 text-sm lg:text-base">Keperluan</span>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Isi alasan keperluan"
              onChange={(e) => setAlsnKeperluan(e.target.value)}
            ></textarea>
            {/* Error message */}
            {blankAlsnKeperluan && (
              <p className="text-red-500 mt-1">{blankAlsnKeperluan}</p>
            )}
          </label>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="btn w-full text-white bg-orange-500 hover:bg-orange-600"
          >
            Kirim Formulir
          </button>
        </form>
      </Modal>
    </>
  );
}
