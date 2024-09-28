import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ModalLoading from "@/components/modalLoading";

export default function AdminKonfirmasi() {
  const [loadingModal, setLoadingModal] = useState(false);

  const formatTanggal = (tanggal) => {
    const format = new Date(tanggal).toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
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
      name: "Tgl Pengajuan",
      selector: (row) => formatTanggal(row.tgl_pengajuan),
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
      name: "Alasan",
      cell: (row) => <div style={{ padding: "8px 0" }}>{row.alasan}</div>,
      sortable: true,
      wrap: true,
      minWidth: "200px",
    },
    {
      name: "Aksi",
      button: true,
      minWidth: "150px",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            className="btn btn-outline btn-success btn-sm"
            onClick={() => handleActionSetuju(row)}
          >
            Setuju
          </button>
          <button
            className="btn btn-outline btn-error btn-sm"
            onClick={() => handleActionTolak(row)}
          >
            Tolak
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
  const fetchData = () => {
    fetch("/api/sedangPinjam")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (pinjaman) => pinjaman.status === "Menunggu Konfirmasi"
        );
        setPinjams(filteredData);
      })
      .catch((err) => {
        setError(err);
      });
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
  function handleActionSetuju(row) {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menyetujui peminjaman aset ${row.nama} oleh ${row.nama_lengkap}`,
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
          const res = await fetch("/api/sedangPinjam", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
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
              text: "Peminjaman berhasil disetujui",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
            fetchData();
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
        }
      }
    });
  }

  // Tolak
  function handleActionTolak(row) {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menolak peminjaman aset ${row.nama} oleh ${row.nama_lengkap}`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#FF5861",
      cancelButtonColor: "#d9d9d9",
      confirmButtonText: "Tolak",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingModal(true);
        try {
          const res = await fetch("/api/selesaiPinjam", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idRiwayat: row.id,
              idAset: row.id_aset,
              idUser: row.id_user,
            }),
          });
          const result = await res.json();
          if (res.status == 200) {
            Swal.fire({
              title: "Berhasil",
              text: "Peminjaman berhasil disetujui",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
            fetchData();
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
        }
      }
    });
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
        <title>Konfirmasi Peminjaman Aset</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Konfirmasi Peminjaman Aset</h1>
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

      {/* Modal Loading */}
      {loadingModal && <ModalLoading />}
    </>
  );
}
