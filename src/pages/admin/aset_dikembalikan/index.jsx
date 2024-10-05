import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ModalLoading from "@/components/modalLoading";
import Modal from "@/components/modal";

export default function AdminKonfirmasi() {
  const [loadingModal, setLoadingModal] = useState(false);

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

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "rgb(255 237 213)",
        fontSize: "16px",
        fontWeight: "600",
      },
    },
    cells: {
      style: {
        fontSize: "16px",
      },
    },
  };

  const columns = [
    {
      name: "Tgl Pengembalian",
      selector: (row) => formatTanggal(row.tgl_pengembalian),
      sortable: true,
      wrap: true,
      width: "170px",
    },
    {
      name: "Nama Aset",
      selector: (row) => row.nama,
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
      sortable: true,
      wrap: true,
      width: "95px",
    },
    {
      name: "Nama Peminjam",
      selector: (row) => row.nama_lengkap,
      sortable: true,
      wrap: true,
      minWidth: "200px",
    },
    {
      name: "No WA",
      selector: (row) => row.no_wa,
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Tgl Mulai",
      selector: (row) => formatTanggal(row.tgl_mulai),
      sortable: true,
      wrap: true,
      width: "140px",
    },
    {
      name: "Tgl Selesai",
      selector: (row) => formatTanggal(row.tgl_selesai),
      sortable: true,
      wrap: true,
      width: "140px",
    },
    {
      name: "Keperluan",
      cell: (row) => <div style={{ padding: "8px 0" }}>{row.keperluan}</div>,
      sortable: true,
      wrap: true,
      minWidth: "200px",
    },
    {
      name: "Aksi",
      button: true,
      minWidth: "200px",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            className="btn btn-outline btn-success btn-sm"
            onClick={() => handleActionSelesai(row)}
          >
            Selesai
          </button>
          <button
            className="btn btn-outline btn-error btn-sm"
            onClick={() => handleActionMasalah(row)}
          >
            Bermasalah
          </button>
        </div>
      ),
    },
  ];

  // fetch data pinjam
  const [pinjams, setPinjams] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await fetch("/api/dikembalikan", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      setPinjams(data);
    } catch (error) {
      setError(error);
    }
  };

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPinjams, setFilteredPinjams] = useState([]);
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filteredSearch = pinjams.filter(
        (pinjam) =>
          pinjam.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pinjam.nama_lengkap
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          pinjam.no_wa.toString().includes(searchTerm)
      );
      setFilteredPinjams(filteredSearch);
    } else {
      setFilteredPinjams(pinjams);
    }
  }, [searchTerm, pinjams]);

  // Setuju
  function handleActionSelesai(row) {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menyelesaikan peminjaman aset ${row.nama} oleh ${row.nama_lengkap}`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#00A96E",
      cancelButtonColor: "#d9d9d9",
      confirmButtonText: "Setuju",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingModal(true);
        try {
          const res = await fetch("/api/dikembalikan", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "apikey": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: JSON.stringify({
              idRiwayat: row.id,
              idUser: row.id_user,
            }),
          });
          const result = await res.json();
          if (res.status == 200) {
            Swal.fire({
              title: "Berhasil",
              text: "Peminjaman berhasil diselesaikan",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
            fetchData();
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
        }
      }
    });
  }

  // Bermasalah
  const [formCatatan, setFormCatatan] = useState(false);
  const [idMasalah, setIdMasalah] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [namaAset, setNamaAset] = useState(null);
  const [textCatatan, setTextCatatan] = useState(null);

  const handleActionMasalah = (row) => {
    setFormCatatan(true)
    setIdMasalah(row.id)
    setIdUser(row.id_user)
    setNamaAset(row.nama)
  }
  const handleCloseMasalah = () => {
    setFormCatatan(false)
    setTextCatatan(null)
  }
  const handleSubmitCatatan = async (event) => {
    event.preventDefault();
    setLoadingModal(true);
    try {
      const res = await fetch("/api/dikembalikan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          idMasalah,
          textCatatan,
          idUser,
        }),
      });
      const result = await res.json();
      if (res.status == 200) {
        Swal.fire({
          title: "Berhasil",
          text: "Peminjaman berhasil diselesaikan",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        fetchData();
        setFormCatatan(false)
        // result.forEach(async (target) => {
        //   try {
        //     const data = new FormData();
        //     data.append("target", `0${target.no_wa}`);
        //     data.append(
        //       "message",
        //       `Halo ${target.nama_lengkap}, pengembalian aset ${namaAset} yang dipinjam *_Terjadi Masalah_*, Segera hubungi atau temui pihak unit admin terkait. Berikut catatan masalah dari admin : ${textCatatan}.`
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
        setFormCatatan(false)
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
      setFormCatatan(false)
    }
  }

  // akses page lain ketika belum login atau tidak login sebagai admin / superadmin
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/check-auth");
      const data = await res.json();

      if (
        res.status !== 200 ||
        (data.role !== "admin" && data.role !== "superadmin")
      ) {
        data.role == "karyawan" ? router.push("/beranda") : router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  // mounted
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Aset Dikembalikan</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Aset Dikembalikan</h1>
        <label className="input input-bordered flex items-center gap-2 w-[300px] mt-4">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoSearch />
        </label>
        <div className="mt-4">
          {isMounted && (
            <DataTable
              columns={columns}
              data={filteredPinjams}
              customStyles={customStyles}
              pagination
            />
          )}
        </div>
      </DefaultLayout>

      {/* Modal Edit Catatan */}
      {formCatatan && (
        <Modal title="Catatan Bermasalah" onCloseModal={handleCloseMasalah}>
          <form className="mt-4" action="" onSubmit={handleSubmitCatatan}>
            {/* Catatan */}
            <label className="form-control w-full">
              <textarea
                className="textarea textarea-bordered"
                placeholder="Isi catatan"
                onChange={(e) => setTextCatatan(e.target.value)}
                required
              >
                {textCatatan}
              </textarea>
            </label>
            {/* Submit */}
            <div className="flex justify-between mt-4">
              <button className="btn" onClick={handleCloseMasalah}>
                Batal
              </button>
              <button
                className="btn bg-orange-500 text-white hover:bg-orange-600"
                type="submit"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Loading */}
      {loadingModal && <ModalLoading />}
    </>
  );
}
