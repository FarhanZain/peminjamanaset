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

export default function AdminDataAdmin() {
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
      name: "No WA",
      selector: (row) => row.no_wa || "-",
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Unit",
      selector: (row) => row.unit || "-",
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Role",
      selector: (row) => row.role,
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

  // Fetch Data Admin & Superadmin
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    fetchDataUnit();
  }, []);
  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      setError(error);
    }
  };
  const fetchDataUnit = async () => {
    try {
      const res = await fetch("/api/unit", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      setUnits(data);
    } catch (error) {
      setError(error);
    }
  };

  // Tambah Admin & Superadmin
  const [addAdmin, setAddAdmin] = useState(false);
  const [levelAdmin, setLevelAdmin] = useState("admin");
  const [usernameAdmin, setUsernameAdmin] = useState("");
  const [waAdmin, setWaAdmin] = useState("");
  const [unitAdmin, setUnitAdmin] = useState(null);

  useEffect(() => {
    if (levelAdmin !== "admin") {
      setWaAdmin(null);
      setUnitAdmin(null);
    }
  }, [levelAdmin]);

  const handleAddAdmin = () => {
    setAddAdmin(true);
    setUnitAdmin(units[0].id);
  };
  const handleCloseAddAdmin = () => {
    setAddAdmin(false);
    setLevelAdmin("admin");
    setUsernameAdmin("");
    setWaAdmin("");
    setUnitAdmin(units[0].id);
  };

  const handleSubmitAddAdmin = async (event) => {
    event.preventDefault();
    setLoadingModal(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ levelAdmin, usernameAdmin, waAdmin, unitAdmin }),
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
      } else {
        Swal.fire({
          title: "Gagal",
          text: result.error,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      setAddAdmin(false);
      setLoadingModal(false);
      setLevelAdmin("admin");
      setUsernameAdmin("");
      setWaAdmin("");
      setUnitAdmin("");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        showConfirmButton: false,
        timer: 10000,
      });
      setAddAdmin(false);
      setLoadingModal(false);
    }
  };

  // Edit Status Admin & Superadmin
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
      text: `ingin merubah status admin`,
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
          const res = await fetch("/api/admin", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "apikey": process.env.NEXT_PUBLIC_API_KEY,
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

  // Hapus Admin & Superadmin
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
          const res = await fetch("/api/admin", {
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
            fetchData();
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
  const [filteredUsers, setFilteredUsers] = useState([]);
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filteredData = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.no_wa?.toString() || "").includes(searchTerm)
      );
      setFilteredUsers(filteredData);
    } else {
      setFilteredUsers(users); // Tampilkan semua data jika pencarian kosong atau kurang dari 2 huruf
    }
  }, [searchTerm, users]);

  // Mounted
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Data Admin</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Data Admin</h1>
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
              onClick={handleAddAdmin}
            >
              <TiPlus size={24} />
              Admin
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

      {/* Modal Add Admin */}
      {addAdmin && (
        <Modal title="Tambah Admin" onCloseModal={handleCloseAddAdmin}>
          <form className="mt-4" action="" onSubmit={handleSubmitAddAdmin}>
            {/* Level Admin */}
            <label className="form-control w-full mt-2">
              <div className="flex flex-col">
                <span className="label-text">Level</span>
                <div className="flex gap-8 mt-2">
                  <div className="form-control">
                    <label className="label gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-orange-500"
                        value={"admin"}
                        onChange={(e) => setLevelAdmin(e.target.value)}
                        defaultChecked
                      />
                      <span className="label-text">Admin</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-orange-500"
                        value={"superadmin"}
                        onChange={(e) => setLevelAdmin(e.target.value)}
                      />
                      <span className="label-text">Superadmin</span>
                    </label>
                  </div>
                </div>
              </div>
            </label>
            {/* Username */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan username"
                className="input input-bordered w-full"
                value={usernameAdmin}
                onChange={(e) => setUsernameAdmin(e.target.value)}
                required
              />
            </label>
            {/* Nomor WA */}
            {levelAdmin == "admin" && (
              <label className="form-control w-full mt-2">
                <div className="label">
                  <span className="label-text">Nomor WA</span>
                </div>
                <input
                  type="number"
                  placeholder="0812XXXXXXX"
                  className="input input-bordered w-full"
                  value={waAdmin}
                  onChange={(e) => setWaAdmin(e.target.value)}
                  required
                />
              </label>
            )}
            {/* Unit Admin */}
            {levelAdmin == "admin" && (
              <label className="form-control w-full mt-2">
                <div className="label">
                  <span className="label-text">Unit</span>
                </div>
                <select
                  className="select select-bordered"
                  value={unitAdmin}
                  onChange={(e) => setUnitAdmin(e.target.value)}
                  required
                >
                  {units.map((un) => (
                    <option key={un.id} value={un.id}>
                      {un.unit}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseAddAdmin}>
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

      {/* Modal Edit Status Admin */}
      {editStatus && (
        <Modal title="Edit Status Admin" onCloseModal={handleCloseEditStatus}>
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
