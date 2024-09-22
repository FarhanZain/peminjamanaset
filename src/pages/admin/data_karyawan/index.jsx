import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Modal from "@/components/modal";
import ModalLoading from "@/components/modalLoading";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoSearch } from "react-icons/io5";
import { TbFileImport } from "react-icons/tb";
import { TiPlus } from "react-icons/ti";
import Swal from "sweetalert2";

export default function AdminDataKaryawan() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
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
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Nama",
      selector: (row) => row.nama_lengkap,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Alamat",
      cell: (row) => <div style={{ padding: "12px 0" }}>{row.alamat}</div>,
      sortable: true,
      wrap: true,
      minWidth: "350px",
    },
    {
      name: "No WA",
      selector: (row) => row.no_wa,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div
          className={`badge badge-outline ${
            row.status == "Aktif" ? "badge-success" : "badge-error"
          }`}
        >
          {row.status}
        </div>
      ),
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Aksi",
      button: true,
      minWidth: "150px",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            className="btn btn-outline btn-warning btn-sm"
            onClick={() => handleEditStatus(row)}
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

  // Fetch Data Karyawan
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    fetch("/api/karyawan")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        setError(err);
      });
  };

  // Hapus Data Karyawan
  const handleActionHapus = (row) => {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menghapus ${row.username}`,
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
          const res = await fetch("/api/karyawan", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
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
            fetchData();
          } else if (res.status == 500) {
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

  // Import File Tambah Karyawan
  const [importKaryawan, setImportKaryawan] = useState(false);
  const handleImportKaryawan = () => {
    setImportKaryawan(true);
  };
  const handleCloseImportKaryawan = () => {
    setImportKaryawan(false);
  };
  const handleSubmitImportKaryawan = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Berhasil",
      text: "Data Karyawan berhasil diimpor.",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
    setImportKaryawan(false);
  };

  // Tambah Data Karyawan
  const [addKaryawan, setAddKaryawan] = useState(false);
  const [namaKaryawan, setNamaKaryawan] = useState("");
  const [alamatKaryawan, setAlamatKaryawan] = useState("");
  const [waKaryawan, setWaKaryawan] = useState("");
  const handleAddKaryawan = () => {
    setAddKaryawan(true);
  };
  const handleCloseAddKaryawan = () => {
    setAddKaryawan(false);
  };
  const handleSubmitAddKaryawan = async (event) => {
    event.preventDefault();
    setLoadingModal(true);
    try {
      const res = await fetch("/api/karyawan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ namaKaryawan, alamatKaryawan, waKaryawan }),
      });
      const result = await res.json();
      if (res.status == 201) {
        Swal.fire({
          title: "Berhasil",
          text: result.message,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        fetchData();
      } else if (res.status == 409) {
        Swal.fire({
          title: "Gagal",
          text: result.error,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      } else if (res.status == 500) {
        Swal.fire({
          title: "Gagal",
          text: result.error,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      setAddKaryawan(false);
      setLoadingModal(false);
      // setUsernameAdmin("");
      // setWaAdmin("");
      // setUnitAdmin("");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        showConfirmButton: false,
        timer: 10000,
      });
      setAddKaryawan(false);
      setLoadingModal(false);
    }
  };

  // Edit Status Karyawan
  const [editStatus, setEditStatus] = useState(null);
  const [statusActive, setStatusActive] = useState(null);
  const [statusText, setStatusText] = useState("");
  const handleEditStatus = (row) => {
    setEditStatus(row);
    if (row.status === "Aktif") {
      setStatusActive(true);
      setStatusText("Aktif");
    } else if (row.status === "Tidak Aktif") {
      setStatusActive(false);
      setStatusText("Tidak Aktif");
    }
  };
  const handleChangeStatus = () => {
    if (statusActive == true) {
      setStatusActive(false);
      setStatusText("Tidak Aktif");
    } else if (statusActive == false) {
      setStatusActive(true);
      setStatusText("Aktif");
    }
  };
  const handleCloseEditStatus = () => {
    setEditStatus(null);
  };
  const handleSubmitEditStatus = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin merubah status karayawan`,
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
          const res = await fetch("/api/karyawan", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              updatedId: editStatus.id,
              updatedStatus: statusText,
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
            fetchData();
          } else if (res.status == 500) {
            Swal.fire({
              title: "Gagal",
              text: result.error,
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          }
          setLoadingModal(false);
          setEditStatus(null);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error,
            icon: "error",
            showConfirmButton: false,
            timer: 10000,
          });
          setLoadingModal(false);
          setEditStatus(null);
        }
      }
    });
  };

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

  // Search
  const [searchTerm, setSearchTerm] = useState(""); // State untuk input pencarian
  const [filteredUsers, setFilteredUsers] = useState([]);
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filteredData = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.no_wa.toString().includes(searchTerm)
      );
      setFilteredUsers(filteredData);
    } else {
      setFilteredUsers(users); // Tampilkan semua data jika pencarian kosong atau kurang dari 2 huruf
    }
  }, [searchTerm, users]);

  // mounted
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Data Karyawan</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Data Karyawan</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              className="btn btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:border-orange-500"
              onClick={handleImportKaryawan}
            >
              <TbFileImport size={20} />
              Impor File
            </button>
            <button
              className="btn bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleAddKaryawan}
            >
              <TiPlus size={24} />
              Karyawan
            </button>
          </div>
        </div>
        <div className="mt-4">
          {isMounted && (
            <DataTable
              columns={columns}
              data={filteredUsers}
              customStyles={customStyles}
              pagination
            />
          )}
        </div>
      </DefaultLayout>

      {/* Modal Import File */}
      {importKaryawan && (
        <Modal
          title="Impor Data Karyawan"
          onCloseModal={handleCloseImportKaryawan}
        >
          <form
            className="mt-4"
            action=""
            onSubmit={handleSubmitImportKaryawan}
          >
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept=".xlsx"
              required
            />
            <p className="mt-2 text-error">
              *Masukkan file yang berisi data karyawan
            </p>
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseImportKaryawan}>
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

      {/* Modal Add Karyawan */}
      {addKaryawan && (
        <Modal title="Tambah Karyawan" onCloseModal={handleCloseAddKaryawan}>
          <form className="mt-4" action="" onSubmit={handleSubmitAddKaryawan}>
            {/* Nama Lengkap */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Nama Lengkap</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                className="input input-bordered w-full"
                defaultValue={namaKaryawan}
                onChange={(e) => setNamaKaryawan(e.target.value)}
                required
              />
            </label>
            {/* Alamat */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Alamat</span>
              </div>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Masukkan Alamat"
                defaultValue={alamatKaryawan}
                onChange={(e) => setAlamatKaryawan(e.target.value)}
                required
              ></textarea>
            </label>
            {/* Nomor WA */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Nomor WA</span>
              </div>
              <input
                type="number"
                placeholder="Masukkan nomor wa"
                className="input input-bordered w-full"
                defaultValue={waKaryawan}
                onChange={(e) => setWaKaryawan(e.target.value)}
                required
              />
            </label>
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseAddKaryawan}>
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

      {/* Modal Edit Status Karyawan */}
      {editStatus && (
        <Modal
          title="Edit Status Karyawan"
          onCloseModal={handleCloseEditStatus}
        >
          <form className="mt-8" action="" onSubmit={handleSubmitEditStatus}>
            <div className="form-control">
              <label className="cursor-pointer flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={statusActive}
                  onChange={handleChangeStatus}
                  className="checkbox checkbox-success"
                />
                <p>Aktif</p>
              </label>
            </div>
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseEditStatus}>
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
