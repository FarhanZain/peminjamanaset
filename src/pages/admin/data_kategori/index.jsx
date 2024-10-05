import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Modal from "@/components/modal";
import ModalLoading from "@/components/modalLoading";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoSearch } from "react-icons/io5";
import { TiPlus } from "react-icons/ti";
import Swal from "sweetalert2";

export default function AdminDataUnit() {
  const [loadingModal, setLoadingModal] = useState(false);

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
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Kategori",
      selector: (row) => row.kategori,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Aksi",
      button: true,
      minWidth: "200px",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            className="btn btn-outline btn-warning btn-sm"
            onClick={() => handleEditKategori(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-outline btn-error btn-sm"
            onClick={() => handleActionHapus(row)}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  // Fetch Data Admin & Superadmin
  const [kategoris, setKategoris] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDataKategori();
  }, []);
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

  // Tambah Kategori
  const [addKategori, setAddKategori] = useState(false);
  const [textKategori, setTextKategori] = useState("");

  const handleAddKategori = () => {
    setAddKategori(true);
  };
  const handleCloseAddKategori = () => {
    setAddKategori(false);
    setTextKategori("");
  };

  const handleSubmitAddKategori = async (event) => {
    event.preventDefault();
    setLoadingModal(true);
    try {
      const res = await fetch("/api/kategori", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ textKategori }),
      });
      const result = await res.json();
      if (res.status == 200) {
        Swal.fire({
          title: "Berhasil",
          text: result.message,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        fetchDataKategori();
      } else {
        Swal.fire({
          title: "Gagal",
          text: result.error,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      setAddKategori(false);
      setLoadingModal(false);
      setTextKategori("");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        showConfirmButton: false,
        timer: 10000,
      });
      setAddKategori(false);
      setLoadingModal(false);
    }
  };

  // Edit Kategori
  const [editKategori, setEditKategori] = useState(null);
  const [editTextKategori, setEditTextKategori] = useState(null);
  const handleEditKategori = (row) => {
    setEditKategori(row);
    setEditTextKategori(row.kategori);
  };
  const handleCloseEditKategori = () => {
    setEditKategori(null);
  };
  const handleSubmitEditKategori = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin merubah kategori ${editKategori.kategori}`,
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
        try {
          setLoadingModal(true);
          const res = await fetch("/api/kategori", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "apikey": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: JSON.stringify({
              updatedId: editKategori.id,
              updatedKategori: editTextKategori,
            }),
          });
          const result = await res.json();
          if (res.status == 200) {
            Swal.fire({
              title: "Berhasil",
              text: result.message,
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
            fetchDataKategori();
          } else {
            Swal.fire({
              title: "Gagal",
              text: result.error,
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          }
          setLoadingModal(false);
          setEditKategori(null);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error,
            icon: "error",
            showConfirmButton: false,
            timer: 10000,
          });
          setLoadingModal(false);
          setEditKategori(null);
        }
      }
    });
  };

  // Hapus Kategori
  const handleActionHapus = (row) => {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menghapus kategori ${row.kategori}`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#FF5861",
      cancelButtonColor: "#d9d9d9",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoadingModal(true);
          const res = await fetch("/api/kategori", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "apikey": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: JSON.stringify({ deletedId: row.id }),
          });
          const result = await res.json();
          if (res.status == 200) {
            Swal.fire({
              title: "Berhasil",
              text: result.message,
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
            fetchDataKategori();
          } else {
            Swal.fire({
              title: "Gagal",
              text: result.error,
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
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
  };

  // akses page ketika belum login atau tidak login sebagai admin / superadmin
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/check-auth");
      const data = await res.json();
      if (res.status !== 200 || data.role !== "superadmin") {
        data.role == "karyawan"
          ? router.push("/beranda")
          : data.role == "admin"
          ? router.push("/admin/konfirmasi")
          : router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  // Search
  const [searchTerm, setSearchTerm] = useState(""); // State untuk input pencarian
  const [filteredKategoris, setFilteredKategoris] = useState([]);
  useEffect(() => {
    if (searchTerm.length >= 1) {
      const filteredData = kategoris.filter(
        (kategori) =>
          (kategori.id?.toString() || "").includes(searchTerm) ||
          kategori.kategori.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredKategoris(filteredData);
    } else {
      setFilteredKategoris(kategoris);
    }
  }, [searchTerm, kategoris]);

  // Mounted
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Data Kategori</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Data Kategori</h1>
        <div className="flex flex-col gap-2 md:flex-row md:justify-between mt-4">
          <label className="input input-bordered flex items-center gap-2 w-100 md:w-[300px]">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearch />
          </label>
          <div className="grid grid-cols-1 gap-2">
            <button
              className="btn bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleAddKategori}
            >
              <TiPlus size={24} />
              Kategori
            </button>
          </div>
        </div>
        <div className="mt-4">
          {isMounted && (
            <DataTable
              columns={columns}
              data={filteredKategoris}
              customStyles={customStyles}
              pagination
            />
          )}
        </div>
      </DefaultLayout>

      {/* Modal Add Kategori */}
      {addKategori && (
        <Modal title="Tambah Kategori" onCloseModal={handleCloseAddKategori}>
          <form className="mt-4" action="" onSubmit={handleSubmitAddKategori}>
            {/* Kategori */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Nama Kategori</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan nama kategori"
                className="input input-bordered w-full"
                value={textKategori}
                onChange={(e) => setTextKategori(e.target.value)}
                required
              />
            </label>
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseAddKategori}>
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

      {/* Modal Edit Kategori*/}
      {editKategori && (
        <Modal title="Edit Kategori" onCloseModal={handleCloseEditKategori}>
          <form className="mt-4" action="" onSubmit={handleSubmitEditKategori}>
            <div className="form-control">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Nama Kategori</span>
                </div>
                <input
                  type="text"
                  placeholder="Masukkan nama kategori"
                  className="input input-bordered w-full"
                  value={editTextKategori}
                  onChange={(e) => setEditTextKategori(e.target.value)}
                  required
                />
              </label>
            </div>
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseEditKategori}>
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
