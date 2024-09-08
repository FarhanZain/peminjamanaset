import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Modal from "@/components/modal";
import Head from "next/head";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoSearch } from "react-icons/io5";
import { TiPlus } from "react-icons/ti";
import Swal from "sweetalert2";

export default function AdminDataAdmin() {
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
      selector: (row) => row.usernameAdmin,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "No WA",
      selector: (row) => row.nomorWaAdmin,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Unit",
      selector: (row) => row.unitAdmin,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Level",
      selector: (row) => row.levelAdmin,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div
          className={`badge badge-outline ${
            row.statusAdmin == "Aktif" ? "badge-success" : "badge-error"
          }`}
        >
          {row.statusAdmin}
        </div>
      ),
      sortable: true,
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

  const data = [
    {
      id: 1,
      usernameAdmin: "admin1",
      nomorWaAdmin: "081234567890",
      unitAdmin: "-",
      levelAdmin: "Super Admin",
      statusAdmin: "Aktif",
    },
    {
      id: 2,
      usernameAdmin: "admin2",
      unitAdmin: "SD",
      levelAdmin: "Admin",
      nomorWaAdmin: "081234567890",
      statusAdmin: "Aktif",
    },
    {
      id: 3,
      usernameAdmin: "admin3",
      unitAdmin: "SMP",
      levelAdmin: "Admin",
      nomorWaAdmin: "081234567890",
      statusAdmin: "Tidak Aktif",
    },
  ];

  function handleActionHapus(row) {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menghapus ${row.usernameAdmin}`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#FF5861",
      cancelButtonColor: "#d9d9d9",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Berhasil",
          text: "Admin telah dihapus.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }

  // Add Karyawan

  const [addAdmin, setAddAdmin] = useState(false);

  const handleAddAdmin = () => {
    setAddAdmin(true);
  };

  const handleCloseAddAdmin = () => {
    setAddAdmin(false);
  };

  const handleSubmitAddAdmin = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Berhasil",
      text: "Data Admin berhasil ditambahkan.",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
    setAddAdmin(false);
  };

  // Edit Status

  const [editStatus, setEditStatus] = useState(null);
  const [statusActive, setStatusActive] = useState(null);

  const handleEditStatus = (row) => {
    setEditStatus(row);
    setStatusActive(row.statusAdmin == "Aktif");
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
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Berhasil",
          text: "Status sudah diperbarui.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        setEditStatus(null);
      }
    });
  };

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
            <input type="text" className="grow" placeholder="Search" />
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
              data={data}
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
            {/* Nomor WA */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Nomor WA</span>
              </div>
              <input
                type="number"
                placeholder="Masukkan nomor wa"
                className="input input-bordered w-full"
                required
              />
            </label>
            {/* Unit Admin */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Unit</span>
              </div>
              <select className="select select-bordered" required>
                <option value="General">General</option>
                <option value="Yayasan">Yayasan</option>
                <option value="SMA">SMA</option>
                <option value="SMP">SMP</option>
                <option value="SD">SD</option>
                <option value="TK">TK</option>
              </select>
            </label>
            {/* Level Admin */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Level Admin</span>
              </div>
              <select className="select select-bordered" required>
                <option value="Admin">Admin</option>
                <option value="Superadmin">Superadmin</option>
              </select>
            </label>
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
                  onChange={() => setStatusActive(!statusActive)}
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
    </>
  );
}
