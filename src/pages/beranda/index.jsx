import React, { useEffect, useState } from "react";
import Image from "next/image";
import CardBeranda from "@/components/cardBeranda";
import Navbar from "@/components/navbar";
import Head from "next/head";
import Modal from "@/components/modal";
import { MdNumbers } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function PageBeranda() {
  const [activeModalId, setActiveModalId] = useState(null);
  const [modalFormPeminjaman, setModalFormPeminjaman] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const handleCardClick = (card) => {
    setActiveModalId(card);
  };

  const handleCloseModal = () => {
    setActiveModalId(null);
  };

  const handleFormPeminjaman = () => {
    setModalFormPeminjaman({
      noAsset: activeModalId.nomorAset,
      namaAsset: activeModalId.namaAset,
      namaKaryawan: "Farhan Abdurrahman Zain",
      nomorKaryawan: "081234567890",
      alamatKaryawan: "Perum Mekarsari Blok D 100 Tiban Lama, Sekupang, Batam",
    });
  };

  const handleCloseForm = () => {
    setModalFormPeminjaman(null);
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    setActiveModalId(null);
    setModalFormPeminjaman(null);
    Swal.fire({
      title: "Berhasil",
      text: "Aset telah dipinjam.",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // akses page lain ketika belum login atau tidak login sebagai karyawan
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/check-auth");
      const data = await res.json();

      if (res.status !== 200 || data.role !== "karyawan") {
        data.role == "admin" || data.role == "superadmin"
          ? router.push("/admin/konfirmasi")
          : router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <>
      <Head>
        <title>Beranda</title>
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
              <div
                className={`badge badge-outline mb-4 ${
                  activeModalId.statusAset == "Tersedia"
                    ? "badge-success"
                    : "badge-error"
                }`}
              >
                {activeModalId.statusAset}
              </div>
              {activeModalId.statusAset == "Tersedia" ? (
                <button
                  type="button"
                  className="btn w-full text-white bg-orange-500 hover:bg-orange-600"
                  onClick={handleFormPeminjaman}
                >
                  Pinjam
                </button>
              ) : (
                ""
              )}
            </Modal>
          )}

          {/* Modal Form Peminjaman */}
          {modalFormPeminjaman && (
            <Modal title="Formulir Peminjaman" onCloseModal={handleCloseForm}>
              <form action="" className="my-3" onSubmit={handleSubmitForm}>
                <table className="table">
                  <tbody>
                    <tr>
                      <th>No Aset</th>
                      <td>{modalFormPeminjaman.noAsset}</td>
                    </tr>
                    <tr>
                      <th>Nama Aset</th>
                      <td>{modalFormPeminjaman.namaAsset}</td>
                    </tr>
                    <tr>
                      <th>Nama Lengkap</th>
                      <td>{modalFormPeminjaman.namaKaryawan}</td>
                    </tr>
                    <tr>
                      <th>Nomor WA</th>
                      <td>{modalFormPeminjaman.nomorKaryawan}</td>
                    </tr>
                    <tr>
                      <th>Alamat</th>
                      <td>{modalFormPeminjaman.alamatKaryawan}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex gap-4 mt-5">
                  <label className="form-control w-full mb-4">
                    <span className="mb-1 text-sm lg:text-base">
                      Tanggal Mulai
                    </span>
                    <input
                      id="mulaiPinjam"
                      type="date"
                      placeholder="Tanggal Mulai"
                      className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
                      required
                      min={today}
                    />
                  </label>

                  <label className="form-control w-full mb-4">
                    <span className="mb-1 text-sm lg:text-base">
                      Tanggal Selesai
                    </span>
                    <input
                      id="selesaiPinjam"
                      type="date"
                      placeholder="Tanggal Selesai"
                      className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
                      required
                      min={today}
                    />
                  </label>
                </div>

                <label className="form-control w-full mb-4">
                  <span className="mb-1 text-sm lg:text-base">Keperluan</span>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Isi alasan keperluan"
                    required
                  ></textarea>
                </label>

                <button
                  type="submit"
                  className="btn w-full text-white bg-orange-500 hover:bg-orange-600"
                >
                  Kirim Formulir
                </button>
              </form>
            </Modal>
          )}

          {/* Card Item Aset */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
            {cards.map((card) => (
              <CardBeranda
                key={card.id}
                cardId={card.id}
                fotoAset={card.fotoAset}
                namaAset={card.namaAset}
                unitAset={card.unitAset}
                statusAset={card.statusAset}
                onCardClick={() => handleCardClick(card)}
              ></CardBeranda>
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
    namaAset: "Kamera Mirrorless 1",
    nomorAset: "UA111111",
    unitAset: "Unit Yayasan",
    lokasiAset: "Kantor Yayasan",
    statusAset: "Tersedia",
  },
  {
    id: 2,
    fotoAset: "/image/detailKamera.png",
    namaAset: "Kamera Mirrorless 2",
    nomorAset: "UA222222",
    unitAset: "Unit SMA",
    lokasiAset: "Gedung 1 SMA",
    statusAset: "Tersedia",
  },
  {
    id: 3,
    fotoAset: "/image/detailKamera.png",
    namaAset: "Kamera Mirrorless 3",
    nomorAset: "UA333333",
    unitAset: "Unit SMP",
    lokasiAset: "Gudang Gedung Bawah",
    statusAset: "Tersedia",
  },
  {
    id: 4,
    fotoAset: "/image/detailKamera.png",
    namaAset: "Kamera Mirrorless 4",
    nomorAset: "UA444444",
    unitAset: "Unit SD",
    lokasiAset: "Gudang Gedung 2",
    statusAset: "Tidak Tersedia",
  },
  {
    id: 5,
    fotoAset: "/image/detailKamera.png",
    namaAset: "Kamera Mirrorless 5",
    nomorAset: "UA555555",
    unitAset: "Unit TK",
    lokasiAset: "Ruangan Kelas Balok",
    statusAset: "Tidak Tersedia",
  },
];
