import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { TbFileImport } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { TiPlus } from "react-icons/ti";
import Modal from "@/components/modal";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function AdminDataAset() {
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
      name: "No Aset",
      selector: (row) => row.nomorAset,
      sortable: true,
      width: "120px",
    },
    {
      name: "Nama Aset",
      selector: (row) => row.namaAset,
      sortable: true,
      wrap: true,
      minWidth: "140px",
    },
    {
      name: "Unit",
      selector: (row) => row.unitAset,
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Lokasi",
      selector: (row) => row.lokasiAset,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Gambar",
      cell: (row) => <img height="84px" width="56px" src={row.gambarAset} />,
      sortable: true,
      width: "200px",
    },
    {
      name: "Aksi",
      button: true,
      minWidth: "150px",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            className="btn btn-outline btn-warning btn-sm"
            onClick={() => handleEditByForm(row)}
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
      nomorAset: "12345678",
      namaAset: "Kamera Mirrorless Sony A6700",
      unitAset: "Unit TK",
      lokasiAset: "Kelas Argentina",
      gambarAset: "081234567890",
    },
    {
      id: 2,
      nomorAset: "12345678",
      namaAset: "Kamera Mirrorless Sony A6400",
      unitAset: "Unit SD",
      lokasiAset: "Gudang Gedung 1",
      gambarAset: "081234567890",
    },
    {
      id: 3,
      nomorAset: "12345678",
      namaAset: "Kamera Mirrorless Sony A6000",
      unitAset: "Unit SMP",
      lokasiAset: "Gudang Gedung 2 pojok",
      gambarAset: "081234567890",
    },
  ];

  function handleActionHapus(row) {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menghapus aset : ${row.nomorAset} - ${row.namaAset}`,
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
          text: "Aset telah dihapus.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }

  const [importAset, setImportAset] = useState(false);

  const handleImportAset = () => {
    setImportAset(true);
  };

  const handleCloseImportAset = () => {
    setImportAset(false);
  };

  const handleSubmitImportAset = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Berhasil",
      text: "Data Aset berhasil diimpor.",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
    setImportAset(false);
  };

  const [addByForm, setAddByForm] = useState(false);

  const handleAddByForm = () => {
    setAddByForm(true);
  };

  const handleCloseAddByForm = () => {
    setAddByForm(false);
  };

  const handleSubmitAddByForm = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Berhasil",
      text: "Data Aset berhasil ditambahkan.",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
    setAddByForm(false);
  };

  const [addByQR, setAddByQR] = useState(false);

  const handleAddByQR = () => {
    setAddByQR(true);
  };

  const handleCloseAddByQR = () => {
    setAddByQR(false);
  };

  const [editByForm, setEditByForm] = useState(false);
  const [editSelected, setEditSelected] = useState(null);

  const handleChangeValue = (event) => {
    setEditSelected(event.target.value);
  };

  const handleEditByForm = (row) => {
    setEditByForm(true);
    setEditSelected(row);
  };

  const handleCloseEditByForm = () => {
    setEditByForm(false);
  };

  const handleSubmitEditByForm = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Berhasil",
      text: "Data Aset berhasil ditambahkan.",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
    setEditByForm(false);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Data Aset</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Data Aset</h1>
        <div className="flex flex-col gap-2 md:flex-row md:justify-between mt-4">
          <label className="input input-bordered flex items-center gap-2 w-100 md:w-[300px]">
            <input type="text" className="grow" placeholder="Search" />
            <IoSearch />
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              className="btn btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:border-orange-500 col-span-2 md:col-span-1"
              onClick={handleImportAset}
            >
              <TbFileImport size={20} />
              Impor File
            </button>
            <button
              className="btn bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleAddByForm}
            >
              <TiPlus size={24} />
              Aset by Form
            </button>
            <button
              className="btn bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleAddByQR}
            >
              <TiPlus size={24} />
              Aset by QR
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
      {importAset && (
        <Modal title="Impor Data Aset" onCloseModal={handleCloseImportAset}>
          <form className="mt-4" action="" onSubmit={handleSubmitImportAset}>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept=".xlsx"
              required
            />
            <p className="mt-2 text-error">
              *Masukkan file yang berisi data aset
            </p>
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseImportAset}>
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

      {/* Modal Add Aset by Form */}
      {addByForm && (
        <Modal title="Tambah Aset by Form" onCloseModal={handleCloseAddByForm}>
          <form className="mt-4" action="" onSubmit={handleSubmitAddByForm}>
            {/* Nomor Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Nomor Aset</span>
              </div>
              <input
                type="number"
                placeholder="Masukkan nomor aset"
                className="input input-bordered w-full"
                required
              />
            </label>
            {/* Nama Aset */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Nama Aset</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan nama aset"
                className="input input-bordered w-full"
                required
              />
            </label>
            {/* Unit Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Unit Aset</span>
              </div>
              <select className="select select-bordered" required>
                <option>Unit Yayasan</option>
                <option>Unit SMA</option>
                <option>Unit SMP</option>
                <option>Unit SD</option>
                <option>Unit TK</option>
              </select>
            </label>
            {/* Lokasi */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Lokasi</span>
              </div>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Masukkan lokasi"
                required
              ></textarea>
            </label>
            {/* Gamabr Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Gambar Aset</span>
              </div>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                accept=".jpg, .jpeg, .png"
                required
              />
            </label>
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseAddByForm}>
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

      {/* Modal Edit Aset */}
      {editByForm && editSelected && (
        <Modal title="Edit Aset" onCloseModal={handleCloseEditByForm}>
          <form className="mt-4" action="" onSubmit={handleSubmitEditByForm}>
            {/* Nomor Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Nomor Aset</span>
              </div>
              <input
                type="number"
                placeholder="Masukkan nomor aset"
                className="input input-bordered w-full"
                value={editSelected.nomorAset}
                onChange={handleChangeValue}
                required
              />
            </label>
            {/* Nama Aset */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Nama Aset</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan nama aset"
                className="input input-bordered w-full"
                value={editSelected.namaAset}
                onChange={handleChangeValue}
                required
              />
            </label>
            {/* Unit Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Unit Aset</span>
              </div>
              <select
                className="select select-bordered"
                value={editSelected.unitAset}
                onChange={handleChangeValue}
                required
              >
                <option value="Unit Yayasan">Unit Yayasan</option>
                <option value="Unit SMA">Unit SMA</option>
                <option value="Unit SMP">Unit SMP</option>
                <option value="Unit SD">Unit SD</option>
                <option value="Unit TK">Unit TK</option>
              </select>
            </label>
            {/* Lokasi */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Lokasi</span>
              </div>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Masukkan lokasi"
                value={editSelected.lokasiAset}
                onChange={handleChangeValue}
                required
              ></textarea>
            </label>
            {/* Gambar Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Gambar Aset</span>
              </div>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                accept=".jpg, .jpeg, .png"
                required
              />
            </label>
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseEditByForm}>
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

      {/* Modal Add Aset By QR */}
      {addByQR && (
        <Modal title="Tambah Aset by QR" onCloseModal={handleCloseAddByQR}>
          <Scanner
            onScan={(result) => {
              // Cek jika result adalah array dan memiliki setidaknya satu objek dengan rawValue
              if (
                Array.isArray(result) &&
                result.length > 0 &&
                result[0]?.rawValue
              ) {
                // Ambil rawValue dari objek pertama dalam array
                const scanResult = result[0].rawValue;

                Swal.fire({
                  title: "Scan Berhasil!",
                  text: `Hasil: ${scanResult}`,
                  icon: "success",
                  showConfirmButton: false,
                  timer: 2000,
                });
                setAddByQR(false);
              } else {
                // Jika tidak ada rawValue atau tidak ada hasil
                Swal.fire({
                  title: "Scan Gagal",
                  text: "QR code tidak terbaca, coba lagi.",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 2000,
                });
                setAddByQR(false);
              }
            }}
          />
        </Modal>
      )}
    </>
  );
}
