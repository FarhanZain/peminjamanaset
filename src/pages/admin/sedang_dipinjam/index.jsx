import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import DataTable from "react-data-table-component";
import { TbFileExport } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminSedangDipinjam() {
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
      name: "Nama Aset",
      selector: (row) => row.namaAset,
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Nama Peminjam",
      selector: (row) => row.namaPeminjam,
      sortable: true,
      wrap: true,
      minWidth: "200px",
    },
    {
      name: "No WA",
      selector: (row) => row.noWa,
      sortable: true,
      width: "150px",
    },
    {
      name: "Tgl Mulai",
      selector: (row) => row.tglMulai,
      sortable: true,
      width: "130px",
    },
    {
      name: "Tgl Selesai",
      selector: (row) => row.tglSelesai,
      sortable: true,
      width: "135px",
    },
    {
      name: "Alasan",
      cell: (row) => <div style={{ padding: "8px 0" }}>{row.alasan}</div>,
      sortable: true,
      wrap: true,
      minWidth: "200px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div
          className={`badge badge-outline ${
            row.status == "ontime" ? "badge-success" : "badge-error"
          }`}
        >
          {row.status}
        </div>
      ),
      sortable: true,
      width: "135px",
    },
  ];

  const data = [
    {
      id: 1,
      tglPengajuan: "29/08/2024",
      namaAset: "Kamera Mirrorless Sony A6700",
      namaPeminjam: "Muhammad Shalahuddin Zain",
      noWa: "081234567890",
      tglMulai: "02/09/2024",
      tglSelesai: "06/09/2024",
      alasan:
        "untuk keperluan dokumentasi acara kemah nasional selama satu minggu",
      status: "ontime",
    },
    {
      id: 2,
      tglPengajuan: "30/08/2024",
      namaAset: "Kamera Mirrorless Sony A6400",
      namaPeminjam: "Farhan Abdurrahman Zain",
      noWa: "081234567890",
      tglMulai: "02/09/2024",
      tglSelesai: "06/09/2024",
      alasan:
        "untuk keperluan dokumentasi acara kemah provinsi selama satu minggu",
      status: "ontime",
    },
    {
      id: 3,
      tglPengajuan: "31/08/2024",
      namaAset: "Kamera Mirrorless Sony A6000",
      namaPeminjam: "Fakhri Faturrahman Zain",
      noWa: "081234567890",
      tglMulai: "02/09/2024",
      tglSelesai: "06/09/2024",
      alasan: "untuk keperluan dokumentasi acara kemah kota selama satu minggu",
      status: "jatuh tempo",
    },
  ];

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
        <title>Aset Sedang Dipinjam</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Aset Sedang Dipinjam</h1>
        <div className="flex justify-between mt-4">
          <label className="input input-bordered flex items-center gap-2 w-[300px]">
            <input type="text" className="grow" placeholder="Search" />
            <IoSearch />
          </label>
          <button className="btn btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:border-orange-500">
            <TbFileExport size={20} />
            Ekspor File
          </button>
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
