import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { TbFileImport } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { TiPlus } from "react-icons/ti";

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
            onClick={() => handleActionSetuju(row.id)}
          >
            Edit
          </button>
          <button
            className="btn btn-outline btn-error btn-sm"
            onClick={() => handleActionHapus(row.id)}
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

  function handleActionHapus(id) {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menghapus aset ${id}`,
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
            <button className="btn btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:border-orange-500 col-span-2 md:col-span-1">
              <TbFileImport size={20} />
              Impor File
            </button>
            <button className="btn bg-orange-500 text-white hover:bg-orange-600">
              <TiPlus size={24} />
              Aset by Form
            </button>
            <button className="btn bg-orange-500 text-white hover:bg-orange-600">
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
    </>
  );
}
