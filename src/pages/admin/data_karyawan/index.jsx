import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Modal from "@/components/modal";
import Head from "next/head";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoSearch } from "react-icons/io5";
import { TbFileImport } from "react-icons/tb";
import { TiPlus } from "react-icons/ti";
import Swal from "sweetalert2";

export default function AdminDataKaryawan() {
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
      selector: (row) => row.usernameKaryawan,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Nama",
      selector: (row) => row.namaKaryawan,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Alamat",
      cell: (row) => (
        <div style={{ padding: "12px 0" }}>{row.alamatKaryawan}</div>
      ),
      sortable: true,
      wrap: true,
      minWidth: "350px",
    },
    {
      name: "No WA",
      selector: (row) => row.nomorWaKaryawan,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div
          className={`badge badge-outline ${
            row.statusKaryawan == "Aktif" ? "badge-success" : "badge-error"
          }`}
        >
          {row.statusKaryawan}
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
      usernameKaryawan: "karyawan1",
      namaKaryawan: "Muhammad Shalahuddin Zain",
      alamatKaryawan:
        "Perumahan Mekarsari blok D no 100, Tiban lama, Sekupang, Batam",
      nomorWaKaryawan: "081234567890",
      statusKaryawan: "Aktif",
    },
    {
      id: 2,
      usernameKaryawan: "karyawan2",
      namaKaryawan: "Farhan Abdurrahman Zain",
      alamatKaryawan:
        "Perumahan Mekarsari blok D no 100, Tiban lama, Sekupang, Batam",
      nomorWaKaryawan: "081234567890",
      statusKaryawan: "Aktif",
    },
    {
      id: 3,
      usernameKaryawan: "karyawan3",
      namaKaryawan: "Fakhri Faturrahman Zain",
      alamatKaryawan:
        "Perumahan Mekarsari blok D no 100, Tiban lama, Sekupang, Batam",
      nomorWaKaryawan: "081234567890",
      statusKaryawan: "Tidak Aktif",
    },
  ];

  function handleActionHapus(row) {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menghapus ${row.usernameKaryawan}`,
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
          text: "Karyawan telah dihapus.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }

  // Import File

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

  // Add Karyawan

  const [addKaryawan, setAddKaryawan] = useState(false);

  const handleAddKaryawan = () => {
    setAddKaryawan(true);
  };

  const handleCloseAddKaryawan = () => {
    setAddKaryawan(false);
  };

  const handleSubmitAddKaryawan = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Berhasil",
      text: "Data Karyawan berhasil ditambahkan.",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
    setAddKaryawan(false);
  };

  // Edit Status

  const [editStatus, setEditStatus] = useState(null);
  const [statusActive, setStatusActive] = useState(null);

  const handleEditStatus = (row) => {
    setEditStatus(row);
    setStatusActive(row.statusKaryawan == "Aktif");
  };

  const handleCloseEditStatus = () => {
    setEditStatus(null);
  };

  const handleSubmitEditStatus = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin merubah status karyawan`,
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
            <input type="text" className="grow" placeholder="Search" />
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
              data={data}
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
