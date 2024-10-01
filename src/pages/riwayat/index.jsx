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
import { CiImageOff } from "react-icons/ci";
import ModalLoading from "@/components/modalLoading";

export default function PageRiwayat() {
  const [activeModalId, setActiveModalId] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Jakarta",
  });

  const formatTanggal = (tanggal) => {
    const format = new Date(tanggal).toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return format;
  };

  // Modal Detail
  const [idRiwayat, setIdRiwayat] = useState(null);
  const [idAset, setIdAset] = useState(null);
  const [unitAset, setUnitAset] = useState(null);
  const [tglPengembalian, setTglPengembalian] = useState(null);
  //
  const [namaWa, setNamaWa] = useState(null);
  const [asetWa, setAsetWa] = useState(null);

  const handleClickCard = (aset) => {
    setActiveModalId(aset);
    setIdRiwayat(aset.id_riwayat);
    setIdAset(aset.id_aset);
    setUnitAset(aset.unit);
    setTglPengembalian(today);
    //
    setNamaWa(users.nama_lengkap);
    setAsetWa(aset.nama);
  };
  const handleCloseModal = () => {
    setActiveModalId(null);
  };

  // Modal Kembalikan
  const handleKembalikan = () => {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin mengembalikan aset yang dipinjam`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#FF5861",
      cancelButtonColor: "#d9d9d9",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingModal(true);
        try {
          const res = await fetch("/api/riwayat", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idRiwayat,
              idAset,
              unitAset,
              tglPengembalian,
            }),
          });
          const result = await res.json();
          if (res.status == 200) {
            Swal.fire({
              title: "Berhasil",
              text: "Peminjaman berhasil dikembalikan",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
            fetchData();
            setActiveModalId(null);
            // result.forEach(async (target) => {
            //   try {
            //     const data = new FormData();
            //     data.append("target", `0${target.no_wa}`);
            //     data.append(
            //       "message",
            //       `Halo Admin, aset ${idAset} - ${asetWa} *_telah dikembalikan_* oleh ${namaWa}. Terima kasih.`
            //     );
            //     data.append("delay", "0");
            //     data.append("countryCode", "62");

            //     const resWa = await fetch("https://api.fonnte.com/send", {
            //       method: "POST",
            //       mode: "cors",
            //       headers: new Headers({
            //         Authorization: "pVHcLp66otGgrACBuCWm",
            //       }),
            //       body: data,
            //     });
            //     const waResult = await resWa.json();
            //     if (waResult.status) {
            //       console.log(`Pesan berhasil dikirim ke Admin`);
            //     } else {
            //       console.log(`Gagal mengirim pesan ke Admin`);
            //     }
            //   } catch (error) {
            //     console.log(error);
            //   }
            // });
          } else {
            Swal.fire({
              title: "Gagal",
              text: result.error,
              icon: "error",
              showConfirmButton: false,
              timer: 5000,
            });
          }
          setLoadingModal(false);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error,
            icon: "error",
            showConfirmButton: false,
            timer: 10000,
          });
          setLoadingModal(false);
          setActiveModalId(null);
        }
      }
    });
  };

  // Modal Batalkan
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingModal(true);
        try {
          const res = await fetch("/api/beranda", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idRiwayat,
              idAset,
              unitAset,
            }),
          });
          const result = await res.json();
          if (res.status == 200) {
            Swal.fire({
              title: "Berhasil",
              text: "Peminjaman berhasil dibatalkan",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
            fetchData();
            setActiveModalId(null);
            // result.forEach(async (target) => {
            //   try {
            //     const data = new FormData();
            //     data.append("target", `0${target.no_wa}`);
            //     data.append(
            //       "message",
            //       `Halo Admin, aset ${idAset} - ${asetWa} *_Batal dipinjam_* oleh ${namaWa}. Terima kasih.`
            //     );
            //     data.append("delay", "0");
            //     data.append("countryCode", "62");

            //     const resWa = await fetch("https://api.fonnte.com/send", {
            //       method: "POST",
            //       mode: "cors",
            //       headers: new Headers({
            //         Authorization: "pVHcLp66otGgrACBuCWm",
            //       }),
            //       body: data,
            //     });
            //     const waResult = await resWa.json();
            //     if (waResult.status) {
            //       console.log(`Pesan berhasil dikirim ke Admin`);
            //     } else {
            //       console.log(`Gagal mengirim pesan ke Admin`);
            //     }
            //   } catch (error) {
            //     console.log(error);
            //   }
            // });
            // console.log(result);
          } else {
            Swal.fire({
              title: "Gagal",
              text: result.error,
              icon: "error",
              showConfirmButton: false,
              timer: 5000,
            });
          }
          setLoadingModal(false);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error,
            icon: "error",
            showConfirmButton: false,
            timer: 10000,
          });
          setLoadingModal(false);
          setActiveModalId(null);
        }
      }
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

  // fetch data diri
  const [users, setUsers] = useState({});
  useEffect(() => {
    // Fetch data dari API route
    fetch("/api/akunKaryawan")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.find((user) => user.id === tokenCookie.id);
        setUsers(filteredData);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  // fetch data aset
  const [asets, setAsets] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    fetch("/api/riwayat")
      .then((response) => response.json())
      .then((data) => {
        setAsets(data);
      })
      .catch((err) => {
        setError(err);
      });
  };

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
              {!activeModalId.gambar ? (
                <div className="w-full h-[200px] lg:h-[300px] flex justify-center items-center bg-slate-100 rounded-2xl my-3">
                  <CiImageOff size={70} />
                </div>
              ) : (
                <img
                  src={activeModalId.gambar}
                  alt="Foto Aset"
                  className="w-full h-[200px] lg:h-[300px] object-cover bg-gray-200 rounded-2xl my-3"
                  loading="lazy"
                />
              )}
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
                  Alasan Meminjam
                </p>
                <p className="text-sm md:text-base mt-2">
                  {activeModalId.alasan}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm md:text-base font-semibold">
                  Masa Pinjam
                </p>
                <p className="text-sm md:text-base mt-2">
                  {formatTanggal(activeModalId.tgl_mulai)} -{" "}
                  {formatTanggal(activeModalId.tgl_selesai)}
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
                      : formatTanggal(activeModalId.tgl_pengajuan)}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-sm md:text-base font-semibold">
                    Tanggal Pengembalian
                  </p>
                  <p className="text-sm md:text-base mt-2">
                    {activeModalId.tgl_pengembalian == null
                      ? "-"
                      : formatTanggal(activeModalId.tgl_pengembalian)}
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

          {/* Card Item Aset */}
          {filteredAsets.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
              {filteredAsets.map((aset) => (
                <CardRiwayat
                  key={aset.id_riwayat}
                  fotoAset={aset.gambar}
                  namaAset={aset.nama}
                  unitAset={aset.unit}
                  statusAset={aset.status}
                  tglMulai={formatTanggal(aset.tgl_mulai)}
                  tglSelesai={formatTanggal(aset.tgl_selesai)}
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

      {/* Modal Loading */}
      {loadingModal && <ModalLoading />}
    </>
  );
}
