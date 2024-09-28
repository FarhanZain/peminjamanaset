import React, { useEffect, useState } from "react";
import CardBeranda from "@/components/cardBeranda";
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

export default function PageBeranda() {
  const [loadingModal, setLoadingModal] = useState(false);

  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Jakarta",
  });

  // Modal Detail
  const [activeModalId, setActiveModalId] = useState(null);
  const handleCardClick = (aset) => {
    setActiveModalId(aset);
  };
  const handleCloseModal = () => {
    setActiveModalId(null);
  };

  // Modal Pinjam
  const [modalFormPeminjaman, setModalFormPeminjaman] = useState(false);
  const [pinjamIdBeranda, setPinjamIdBeranda] = useState(null);
  const [pinjamIdAset, setPinjamIdAset] = useState(null);
  const [pinjamIdUser, setPinjamIdUser] = useState(null);
  const [pinjamUnit, setPinjamUnit] = useState(null);
  const [pinjamPengajuan, setPinjamPengajuan] = useState(null);
  const [pinjamMulai, setPinjamMulai] = useState(null);
  const [pinjamSelesai, setPinjamSelesai] = useState(null);
  const [pinjamAlasan, setPinjamAlasan] = useState("");

  const handleFormPeminjaman = () => {
    setModalFormPeminjaman(true);
    setPinjamIdBeranda(activeModalId.id_beranda);
    setPinjamIdAset(activeModalId.id_aset);
    setPinjamIdUser(users.id);
    setPinjamUnit(activeModalId.unit);
    setPinjamPengajuan(today);
  };
  const handleCloseForm = () => {
    setModalFormPeminjaman(false);
    setPinjamAlasan("")
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoadingModal(true);
    try {
      const res = await fetch("/api/beranda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pinjamIdBeranda,
          pinjamIdAset,
          pinjamIdUser,
          pinjamPengajuan,
          pinjamMulai,
          pinjamSelesai,
          pinjamAlasan,
          pinjamUnit,
        }),
      });
      const result = await res.json();
      if (res.status == 200) {
        Swal.fire({
          title: "Berhasil",
          text: "Peminjaman berhasil diajukan",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        fetchData();
        setActiveModalId(null);
        setModalFormPeminjaman(false);
        setPinjamAlasan("")
        console.log(result);
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
      setModalFormPeminjaman(false);
      setPinjamAlasan("")
    }
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
    fetch("/api/beranda")
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
        <title>Beranda</title>
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
              <div
                className={`badge badge-outline mb-4 ${
                  activeModalId.stok == "Tersedia"
                    ? "badge-success"
                    : "badge-error"
                }`}
              >
                {activeModalId.stok}
              </div>
              {activeModalId.stok == "Tersedia" ? (
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
                      <td>{activeModalId.no_aset}</td>
                    </tr>
                    <tr>
                      <th>Nama Aset</th>
                      <td>{activeModalId.nama}</td>
                    </tr>
                    <tr>
                      <th>Nama Lengkap</th>
                      <td>{users.nama_lengkap}</td>
                    </tr>
                    <tr>
                      <th>Nomor WA</th>
                      <td>{users.no_wa}</td>
                    </tr>
                    <tr>
                      <th>Alamat</th>
                      <td>{users.alamat}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex gap-4 mt-5">
                  <label className="form-control w-full mb-4">
                    <span className="mb-1 text-sm lg:text-base">
                      Tanggal Mulai
                    </span>
                    <input
                      type="date"
                      placeholder="Tanggal Mulai"
                      className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
                      required
                      min={today}
                      onChange={(e) => setPinjamMulai(e.target.value)}
                    />
                  </label>

                  <label className="form-control w-full mb-4">
                    <span className="mb-1 text-sm lg:text-base">
                      Tanggal Selesai
                    </span>
                    <input
                      type="date"
                      placeholder="Tanggal Selesai"
                      className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
                      required
                      min={today}
                      onChange={(e) => setPinjamSelesai(e.target.value)}
                    />
                  </label>
                </div>

                <label className="form-control w-full mb-4">
                  <span className="mb-1 text-sm lg:text-base">Keperluan</span>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Isi alasan keperluan"
                    required
                    value={pinjamAlasan}
                    onChange={(e) => setPinjamAlasan(e.target.value)}
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
          {filteredAsets.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
              {filteredAsets.map((aset) => (
                <CardBeranda
                  key={aset.id_beranda}
                  cardId={aset.id_aset}
                  fotoAset={aset.gambar}
                  namaAset={aset.nama}
                  unitAset={aset.unit}
                  statusAset={aset.stok}
                  onCardClick={() => handleCardClick(aset)}
                ></CardBeranda>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-8">
              <BsFolderX size={50} />
              <p className="mt-2">Tidak ada aset</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Loading */}
      {loadingModal && <ModalLoading />}
    </>
  );
}
