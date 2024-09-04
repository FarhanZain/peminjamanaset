import DefaultLayout from "@/components/Layouts/DefaultLayout";
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

  function handleActionHapus(id) {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menghapus admin ${id}`,
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
            <button className="btn bg-orange-500 text-white hover:bg-orange-600">
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
    </>
  );
}
