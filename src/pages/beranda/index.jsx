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
import { BiCategoryAlt } from "react-icons/bi";

export default function PageBeranda() {
  const [loadingModal, setLoadingModal] = useState(false);

  const today = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).replace(' ', 'T').slice(0, 16)

  const formatTanggal = (tanggal) => {
    const format = new Date(tanggal).toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, 
    });
    return format;
  };

  // Modal Detail
  const [activeModalId, setActiveModalId] = useState(null);
  const [idAset, setIdAset] = useState(null);
  const handleCardClick = (aset) => {
    setActiveModalId(aset);
    setIdAset(aset.id);
  };
  const handleCloseModal = () => {
    setActiveModalId(null);
    setIdAset(null);
  };

  // Modal Pinjam
  const [modalFormPeminjaman, setModalFormPeminjaman] = useState(false);
  const [pinjamIdAset, setPinjamIdAset] = useState(null);
  const [pinjamIdUser, setPinjamIdUser] = useState(null);
  const [pinjamUnit, setPinjamUnit] = useState(null);
  const [pinjamPengajuan, setPinjamPengajuan] = useState(null);
  const [pinjamMulai, setPinjamMulai] = useState('');
  const [pinjamSelesai, setPinjamSelesai] = useState('');
  const [pinjamKeperluan, setPinjamKeperluan] = useState("");
  // wa
  const [namaWa, setNamaWa] = useState(null);
  const [asetWa, setAsetWa] = useState(null);
  // rentang waktu
  const [textPeringatan, setTextPeringatan] = useState('');

  const handleFormPeminjaman = () => {
    setModalFormPeminjaman(true);
    setPinjamIdAset(activeModalId.id);
    setPinjamIdUser(users.id);
    setPinjamUnit(activeModalId.id_units);
    setPinjamPengajuan(today);
    //
    setNamaWa(users.nama_lengkap);
    setAsetWa(activeModalId.nama);
  };
  const handleCloseForm = () => {
    setModalFormPeminjaman(false);
    setPinjamKeperluan("");
    setPinjamMulai('');
    setPinjamSelesai('');
  };

  // Cek Rentang Waktu
  function isRangeOverlapping(mulai1, selesai1, mulai2, selesai2) {
    return (mulai1 < selesai2 && selesai1 > mulai2);
  }
  const cekRentangWaktu = () => {
    if (pinjamMulai && pinjamSelesai) {
      const selectedStart = new Date(pinjamMulai);
      const selectedEnd = new Date(pinjamSelesai);

      if (selectedStart >= selectedEnd) {
        setTextPeringatan('Waktu selesai harus melebihi waktu mulai');
      }else{
        setTextPeringatan('')
      }

      const isBooked = rentangWaktu.filter((rentang) => rentang.id_aset === idAset && (rentang.status_pinjam === "Menunggu Konfirmasi" || rentang.status_pinjam === "Disetujui")).some(rentang => {
        const bookedStart = new Date(rentang.tgl_mulai);
        const bookedEnd = new Date(rentang.tgl_selesai);
        return isRangeOverlapping(selectedStart, selectedEnd, bookedStart, bookedEnd);
      });

      if (isBooked) {
        setTextPeringatan('Rentang waktu ini sudah digunakan, silakan pilih waktu lain.');
        setPinjamMulai('');
        setPinjamSelesai('');
      }
    }
  }
  useEffect(() => {
    cekRentangWaktu();
  }, [pinjamMulai, pinjamSelesai]);

  // Submit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoadingModal(true);
    try {
      const res = await fetch("/api/beranda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          pinjamIdAset,
          pinjamIdUser,
          pinjamPengajuan,
          pinjamMulai,
          pinjamSelesai,
          pinjamKeperluan,
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
        fetchDataRiwayat();
        setActiveModalId(null);
        setModalFormPeminjaman(false);
        setPinjamKeperluan("");
        console.log(result);
        // result.forEach(async (target) => {
        //   try {
        //     const data = new FormData();
        //     data.append("target", `0${target.no_wa}`);
        //     data.append(
        //       "message",
        //       `Halo Admin, aset ${pinjamIdAset} - ${asetWa} *_Ingin dipinjam_* oleh ${namaWa}, segera berikan konfirmasi di dashboard admin. Terima kasih.`
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
      setModalFormPeminjaman(false);
      setPinjamKeperluan("");
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

  // fetch data
  const [asets, setAsets] = useState([]);
  const [rentangWaktu, setRentangWaktu] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [kategoris, setKategoris] = useState([]);
  // filter
  const [filterKategori, setFilterKategori] = useState("");

  useEffect(() => {
    fetchData();
    fetchDataUser();
    fetchDataRiwayat();
    fetchDataKategori();
  }, [filterKategori]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/beranda", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      const filterData = data.filter((item) => item.kategori === filterKategori);
      if (filterKategori) {
        setAsets(filterData);
      }else{
        setAsets(data);
      }
    } catch (error) {
      setError(error);
    }
  };
  const fetchDataUser = async () => {
    try {
      const res = await fetch("/api/akunKaryawan", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      const filteredData = data.find((user) => user.id === tokenCookie.id);
      setUsers(filteredData);
    } catch (error) {
      setError(error);
    }
  };
  const fetchDataRiwayat = async () => {
    try {
      const res = await fetch("/api/rentangWaktu", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      setRentangWaktu(data);
    } catch (error) {
      setError(error);
    }
  };
  const fetchDataKategori = async () => {
    try {
      const res = await fetch("/api/kategori", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      setKategoris(data);
    } catch (error) {
      setError(error);
    }
  };
  

  // Search
  const [searchTerm, setSearchTerm] = useState("");
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
      setFilteredAsets(asets);
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
          <div className="mb-3 grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
            {/* Input Search */}
            <label className="flex items-center w-full gap-2 rounded-xl input input-bordered lg:mb-2">
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
            {/* Filter Kategori */}
            <select className="select select-bordered w-full rounded-xl" 
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {kategoris.map((ktgri) => (
                <option key={ktgri.id} value={ktgri.kategori}>
                  {ktgri.kategori}
                </option>
              ))}
            </select>
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
              <h3 className="text-xl font-bold mb-1">{activeModalId.nama}</h3>
              <p className="mb-2 text-sm">{activeModalId.detail}</p>
              <div className="flex flex-wrap items-center gap-x-4">
                <div
                  className={`badge badge-outline mb-3 ${
                    activeModalId.status_aset == "Tersedia"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {activeModalId.status_aset}
                </div>
                <div className="flex gap-1 items-center mb-3">
                  <MdNumbers className="text-orange-500" />
                  <p className="text-sm">{activeModalId.no_aset}</p>
                </div>
                <div className="flex gap-1 items-center mb-3">
                  <HiOutlineBuildingOffice2 className="text-orange-500" />
                  <p className="text-sm">{activeModalId.unit}</p>
                </div>
                <div className="flex gap-1 items-center mb-3">
                  <BiCategoryAlt className="text-orange-500" />
                  <p className="text-sm">{activeModalId.kategori}</p>
                </div>
                <div className="flex gap-1 items-center mb-3">
                  <HiOutlineLocationMarker className="text-orange-500" />
                  <p className="text-sm">{activeModalId.lokasi}</p>
                </div>
              </div>
              <div className="mb-3">
                <h3 className="font-semibold text-sm">Rentang waktu yang sudah dipinjam :</h3>
                  <div>
                    {rentangWaktu.filter((rentang) => rentang.id_aset === idAset && (rentang.status_pinjam === "Menunggu Konfirmasi" || rentang.status_pinjam === "Disetujui")).length > 0 ? (
                      rentangWaktu.filter((rentang) => rentang.id_aset === idAset && (rentang.status_pinjam === "Menunggu Konfirmasi" || rentang.status_pinjam === "Disetujui")).map((rentang) => (
                        <li key={rentang.id_riwayat} className="mt-1 text-sm">{formatTanggal(rentang.tgl_mulai)} {"\u00A0 \u00A0 - \u00A0 \u00A0"} {formatTanggal(rentang.tgl_selesai)}</li>
                      ))
                    ) : (
                      <p className="mt-1 text-sm">- kosong -</p>
                    )}
                  </div>
              </div>
              {activeModalId.status_aset == "Tersedia" ? (
                <button
                  type="button"
                  className="btn w-full mt-2 text-white bg-orange-500 hover:bg-orange-600"
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
              <form className="my-3" onSubmit={handleSubmitForm}>
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
                      type="datetime-local"
                      placeholder="Tanggal Mulai"
                      className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
                      required
                      value={pinjamMulai}
                      min={today}
                      onChange={(e) => setPinjamMulai(e.target.value)}
                    />
                  </label>

                  <label className="form-control w-full mb-4">
                    <span className="mb-1 text-sm lg:text-base">
                      Tanggal Selesai
                    </span>
                    <input
                      type="datetime-local"
                      placeholder="Tanggal Selesai"
                      className="input input-bordered input-md w-full focus:outline focus:outline-orange-300"
                      required
                      value={pinjamSelesai}
                      min={today}
                      onChange={(e) => setPinjamSelesai(e.target.value)}
                    />
                  </label>
                </div>
                <p className="mb-4 text-sm text-error">{textPeringatan}</p>

                <label className="form-control w-full mb-4">
                  <span className="mb-1 text-sm lg:text-base">Keperluan</span>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Isi keperluan"
                    required
                    value={pinjamKeperluan}
                    onChange={(e) => setPinjamKeperluan(e.target.value)}
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
                  key={aset.id}
                  fotoAset={aset.gambar}
                  namaAset={aset.nama}
                  unitAset={aset.unit}
                  kategoriAset={aset.kategori}
                  statusAset={aset.status_aset}
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
