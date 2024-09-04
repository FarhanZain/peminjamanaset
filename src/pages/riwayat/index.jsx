import React, { useState, useRef, useEffect } from "react";
import CardRiwayat from "@/components/cardRiwayat";
import Navbar from "@/components/navbar";
import Head from "next/head";
import Modal from "@/components/modal";
import { MdNumbers } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Swal from "sweetalert2";

export default function PageRiwayat() {
  const [activeModalId, setActiveModalId] = useState(null);
  const [modalKembalikan, setModalKembalikan] = useState(false);

  const handleClickCard = (card) => {
    setActiveModalId(card);
  };

  const handleCloseModal = () => {
    setActiveModalId(null);
  };

  const handleKembalikan = () => {
    setModalKembalikan(true);
  };

  const handleCloseKembalikan = () => {
    setModalKembalikan(false);
  };

  const handleBatalkan = () => {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin membatalkan peminjaman`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#FF5861",
      cancelButtonColor: "#d9d9d9",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Berhasil",
          text: "Peminjaman telah dibatalkan.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        setActiveModalId(null);
      }
    });
  };

  const handleSubmitKembalikan = (event) => {
    event.preventDefault();
    setActiveModalId(null);
    setModalKembalikan(false);
    Swal.fire({
      title: "Berhasil",
      text: "Aset telah dikembalikan.",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <>
      <Head>
        <title>Riwayat</title>
      </Head>
      <Navbar />
      <div className="container px-6 mx-auto my-20 lg:my-24 lg:px-12">
        <div>
          {/* Filter */}
          <div className="grid grid-cols-1 gap-3 mb-3 lg:grid-cols-3 lg:gap-4">
            {/* Input Search */}
            <label className="flex items-center w-full gap-2 rounded-xl input input-bordered lg:mb-4">
              <input type="text" className="grow" placeholder="Cari" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            {/* Filter Unit */}
            <select className="w-full rounded-xl select select-bordered">
              <option selected>Semua Unit</option>
              <option>Unit Yayasan</option>
              <option>Unit SMA</option>
              <option>Unit SMP</option>
              <option>Unit SD</option>
              <option>Unit TK</option>
            </select>
            {/* Filter Status */}
            <select className="w-full rounded-xl select select-bordered">
              <option selected>Semua Status</option>
              <option>Tersedia</option>
              <option>Tidak Tersedia</option>
            </select>
          </div>

          {/* Modal Detail Aset */}
          {activeModalId && (
            <Modal title="Detail" onCloseModal={handleCloseModal}>
              <img
                src={activeModalId.fotoAset}
                alt="Foto Aset"
                className="w-full h-[200px] lg:h-[300px] object-contain bg-gray-200 rounded-2xl my-3"
                loading="lazy"
              />
              <h3 className="text-xl font-bold mb-3">
                {activeModalId.namaAset}
              </h3>
              <div
                className={`badge badge-outline mb-4 ${
                  activeModalId.statusAset == "Menunggu Konfirmasi"
                    ? "badge-primary"
                    : activeModalId.statusAset == "Sedang Dipinjam"
                    ? "badge-info"
                    : activeModalId.statusAset == "Jatuh Tempo"
                    ? "badge-secondary"
                    : activeModalId.statusAset == "Selesai"
                    ? "badge-success"
                    : activeModalId.statusAset == "Dibatalkan"
                    ? "badge-error"
                    : activeModalId.statusAset == "Ditolak"
                    ? "badge-error"
                    : "badge-neutral"
                }`}
              >
                {activeModalId.statusAset}
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex gap-1 items-center mb-3">
                  <MdNumbers className="text-orange-500" />
                  <p className="text-sm">{activeModalId.nomorAset}</p>
                </div>
                <div className="flex gap-1 items-center mb-3">
                  <HiOutlineBuildingOffice2 className="text-orange-500" />
                  <p className="text-sm">{activeModalId.unitAset}</p>
                </div>
                <div className="flex gap-1 items-center mb-3">
                  <HiOutlineLocationMarker className="text-orange-500" />
                  <p className="text-sm">{activeModalId.lokasiAset}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm md:text-base font-semibold">
                  Masa Pinjam
                </p>
                <p className="text-sm md:text-base mt-2">
                  {activeModalId.masaPinjam}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <div className="mt-2">
                  <p className="text-sm md:text-base font-semibold">
                    Tanggal Pengajuan
                  </p>
                  <p className="text-sm md:text-base mt-2">
                    {activeModalId.tanggalPengajuan}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-sm md:text-base font-semibold">
                    Tanggal Pengembalian
                  </p>
                  <p className="text-sm md:text-base mt-2">
                    {activeModalId.tanggalPengembalian}
                  </p>
                </div>
              </div>
              {activeModalId.statusAset == "Menunggu Konfirmasi" ? (
                <button
                  type="button"
                  className="btn btn-outline w-full text-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-500 mt-8"
                  onClick={handleBatalkan}
                >
                  Batalkan
                </button>
              ) : activeModalId.statusAset == "Sedang Dipinjam" ? (
                <button
                  type="button"
                  className="btn btn-outline w-full text-white bg-orange-500 hover:bg-orange-600 mt-8"
                  onClick={handleKembalikan}
                >
                  Kembalikan
                </button>
              ) : activeModalId.statusAset == "Jatuh Tempo" ? (
                <button
                  type="button"
                  className="btn btn-outline w-full text-white bg-orange-500 hover:bg-orange-600 mt-8"
                  onClick={handleKembalikan}
                >
                  Kembalikan
                </button>
              ) : (
                ""
              )}
            </Modal>
          )}

          {/* Modal Kembalikan Aset */}
          {modalKembalikan && (
            <Modal
              title="Kembalikan Peminjaman"
              onCloseModal={handleCloseKembalikan}
            >
              <form
                className="mt-4"
                action=""
                onSubmit={handleSubmitKembalikan}
              >
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  required
                />
                <p className="mt-2 text-error">
                  *Masukkan foto aset sesuai dengan tempat asalnya
                </p>
                <div className="flex justify-between mt-4">
                  <button className="btn" onClick={handleCloseKembalikan}>
                    Batal
                  </button>
                  <button
                    className="btn bg-orange-500 text-white hover:bg-orange-600"
                    type="submit"
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </Modal>
          )}

          {/* Card Item Aset */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
            {cards.map((card) => (
              <CardRiwayat
                key={card.id}
                fotoAset={card.fotoAset}
                namaAset={card.namaAset}
                unitAset={card.unitAset}
                statusAset={card.statusAset}
                durasiPinjam={card.masaPinjam}
                onCardClick={() => handleClickCard(card)}
              ></CardRiwayat>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const cards = [
  {
    id: 1,
    fotoAset: "/image/detailKamera.png",
    statusAset: "Menunggu Konfirmasi",
    namaAset: "Kamera Mirrorless 1",
    unitAset: "Unit Yayasan",
    nomorAset: "UA111111",
    lokasiAset: "Kantor Yayasan",
    masaPinjam: "04/09/2024 - 10/09/2024",
    tanggalPengajuan: "04/09/2024",
    tanggalPengembalian: "-",
  },
  {
    id: 2,
    fotoAset: "/image/detailKamera.png",
    statusAset: "Sedang Dipinjam",
    namaAset: "Kamera Mirrorless 2",
    unitAset: "Unit SMA",
    nomorAset: "UA222222",
    lokasiAset: "Gedung 1 SMA",
    masaPinjam: "05/09/2024 - 11/09/2024",
    tanggalPengajuan: "05/09/2024",
    tanggalPengembalian: "-",
  },
  {
    id: 3,
    fotoAset: "/image/detailKamera.png",
    statusAset: "Jatuh Tempo",
    namaAset: "Kamera Mirrorless 3",
    unitAset: "Unit SMP",
    nomorAset: "UA333333",
    lokasiAset: "Gudang Gedung Bawah",
    masaPinjam: "06/09/2024 - 12/09/2024",
    tanggalPengajuan: "06/09/2024",
    tanggalPengembalian: "-",
  },
  {
    id: 4,
    fotoAset: "/image/detailKamera.png",
    statusAset: "Selesai",
    namaAset: "Kamera Mirrorless 4",
    unitAset: "Unit SD",
    nomorAset: "UA444444",
    lokasiAset: "Gudang Gedung 2",
    masaPinjam: "07/09/2024 - 13/09/2024",
    tanggalPengajuan: "07/09/2024",
    tanggalPengembalian: "13/09/2024",
  },
  {
    id: 5,
    fotoAset: "/image/detailKamera.png",
    statusAset: "Dibatalkan",
    namaAset: "Kamera Mirrorless 5",
    unitAset: "Unit TK",
    nomorAset: "UA555555",
    lokasiAset: "Ruangan Kelas Balok",
    masaPinjam: "08/09/2024 - 14/09/2024",
    tanggalPengajuan: "08/09/2024",
    tanggalPengembalian: "-",
  },
  {
    id: 6,
    fotoAset: "/image/detailKamera.png",
    statusAset: "Ditolak",
    namaAset: "Kamera Mirrorless 6",
    unitAset: "Unit TK",
    nomorAset: "UA666666",
    lokasiAset: "Ruangan Kelas Balok",
    masaPinjam: "09/09/2024 - 15/09/2024",
    tanggalPengajuan: "09/09/2024",
    tanggalPengembalian: "-",
  },
];
