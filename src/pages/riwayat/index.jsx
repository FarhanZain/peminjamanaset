import React, { useState, useRef, useEffect } from "react";
import CardRiwayat from "@/components/cardRiwayat";
import Navbar from "@/components/navbar";
import Head from "next/head";
import Modal from "@/components/modal";
import { MdNumbers } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { BsFolderX } from "react-icons/bs";

export default function PageRiwayat() {
  const [activeModalId, setActiveModalId] = useState(null);
  const [modalKembalikan, setModalKembalikan] = useState(false);

  const handleClickCard = (aset) => {
    setActiveModalId(aset);
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

  // akses page lain ketika belum login atau tidak login sebagai karyawan
  const router = useRouter();
  let tokenCookie;
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/check-auth");
      const data = await res.json();
      tokenCookie = data;

      if (res.status !== 200 || data.role !== "karyawan") {
        data.role == "admin" || data.role == "superadmin"
          ? router.push("/admin/konfirmasi")
          : router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  // fetch data aset
  const [asets, setAsets] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Fetch data dari API route
    fetch("/api/riwayat")
      .then((response) => response.json())
      .then((data) => {
        setAsets(data); // Menyimpan data ke state
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  // Search
  const [searchTerm, setSearchTerm] = useState(""); // State untuk input pencarian
  const [filteredAsets, setFilteredAsets] = useState([]);
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filteredData = asets.filter(
        (aset) =>
          aset.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          aset.unit.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAsets(filteredData);
    } else {
      setFilteredAsets(asets); // Tampilkan semua data jika pencarian kosong atau kurang dari 2 huruf
    }
  }, [searchTerm, asets]);

  return (
    <>
      <Head>
        <title>Riwayat</title>
      </Head>
      <Navbar />
      <div className="container px-6 mx-auto my-20 lg:my-24 lg:px-12">
        <div>
          {/* Filter */}
          <div className="mb-3">
            {/* Input Search */}
            <label className="flex items-center w-full gap-2 rounded-xl input input-bordered lg:mb-4">
              <input
                type="text"
                className="grow"
                placeholder="Cari"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
          </div>

          {/* Modal Detail Aset */}
          {activeModalId && (
            <Modal title="Detail" onCloseModal={handleCloseModal}>
              <img
                src={activeModalId.gambar}
                alt="Foto Aset"
                className="w-full h-[200px] lg:h-[300px] object-contain bg-gray-200 rounded-2xl my-3"
                loading="lazy"
              />
              <h3 className="text-xl font-bold mb-3">{activeModalId.nama}</h3>
              <div
                className={`badge badge-outline mb-4 ${
                  activeModalId.status == "Menunggu Konfirmasi"
                    ? "badge-primary"
                    : activeModalId.status == "Sedang Dipinjam"
                    ? "badge-info"
                    : activeModalId.status == "Jatuh Tempo"
                    ? "badge-secondary"
                    : activeModalId.status == "Selesai"
                    ? "badge-success"
                    : activeModalId.status == "Dibatalkan"
                    ? "badge-error"
                    : activeModalId.status == "Ditolak"
                    ? "badge-error"
                    : "badge-neutral"
                }`}
              >
                {activeModalId.status}
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex gap-1 items-center mb-3">
                  <MdNumbers className="text-orange-500" />
                  <p className="text-sm">{activeModalId.no_aset}</p>
                </div>
                <div className="flex gap-1 items-center mb-3">
                  <HiOutlineBuildingOffice2 className="text-orange-500" />
                  <p className="text-sm">{activeModalId.unit}</p>
                </div>
                <div className="flex gap-1 items-center mb-3">
                  <HiOutlineLocationMarker className="text-orange-500" />
                  <p className="text-sm">{activeModalId.lokasi}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm md:text-base font-semibold">
                  Masa Pinjam
                </p>
                <p className="text-sm md:text-base mt-2">
                  {activeModalId.tgl_mulai} - {activeModalId.tgl_selesai}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <div className="mt-2">
                  <p className="text-sm md:text-base font-semibold">
                    Tanggal Pengajuan
                  </p>
                  <p className="text-sm md:text-base mt-2">
                    {activeModalId.tgl_pengajuan == null
                      ? "-"
                      : activeModalId.tgl_pengajuan}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-sm md:text-base font-semibold">
                    Tanggal Pengembalian
                  </p>
                  <p className="text-sm md:text-base mt-2">
                    {activeModalId.tgl_pengembalian == null
                      ? "-"
                      : activeModalId.tgl_pengembalian}
                  </p>
                </div>
              </div>
              {activeModalId.status == "Menunggu Konfirmasi" ? (
                <button
                  type="button"
                  className="btn btn-outline w-full text-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-500 mt-8"
                  onClick={handleBatalkan}
                >
                  Batalkan
                </button>
              ) : activeModalId.status == "Sedang Dipinjam" ? (
                <button
                  type="button"
                  className="btn btn-outline w-full text-white bg-orange-500 hover:bg-orange-600 mt-8"
                  onClick={handleKembalikan}
                >
                  Kembalikan
                </button>
              ) : activeModalId.status == "Jatuh Tempo" ? (
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
                  accept=".jpg, .jpeg, .png"
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
          {filteredAsets.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
              {filteredAsets.map((aset) => (
                <CardRiwayat
                  key={aset.id}
                  fotoAset={aset.gambar}
                  namaAset={aset.nama}
                  unitAset={aset.unit}
                  statusAset={aset.status}
                  tglMulai={aset.tgl_mulai}
                  tglSelesai={aset.tgl_selesai}
                  onCardClick={() => handleClickCard(aset)}
                ></CardRiwayat>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-8">
              <BsFolderX size={50} />
              <p className="mt-2">Tidak ada riwayat peminjaman</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
