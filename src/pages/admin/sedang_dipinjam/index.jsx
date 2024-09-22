import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import DataTable from "react-data-table-component";
import { TbFileExport } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";

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
      selector: (row) => row.nama,
      sortable: true,
      wrap: true,
      minWidth: "100px",
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
      selector: (row) => row.tgl_mulai,
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Tgl Selesai",
      selector: (row) => row.tgl_selesai,
      sortable: true,
      wrap: true,
      width: "150px",
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
            row.status == "Sedang Dipinjam" ? "badge-success" : "badge-error"
          }`}
        >
          {row.status}
        </div>
      ),
      sortable: true,
      width: "170px",
    },
  ];

  // fetch data pinjam
  const [pinjams, setPinjams] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Fetch data dari API route
    fetch("/api/sedangPinjam")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (pinjaman) =>
            pinjaman.status === "Sedang Dipinjam" ||
            pinjaman.status === "Jatuh Tempo"
        );
        setPinjams(filteredData); // Menyimpan data ke state
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  // Search
  const [searchTerm, setSearchTerm] = useState(""); // State untuk input pencarian
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
      setFilteredPinjams(pinjams); // Tampilkan semua data jika pencarian kosong atau kurang dari 2 huruf
    }
  }, [searchTerm, pinjams]);

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

  // Export File xlsx
  const handleExportFile = () => {
    const dataToExport = pinjams.map((pinjam) => ({
      "Nama Aset": pinjam.nama,
      "Nama Peminjam": pinjam.nama_lengkap,
      "No Wa": pinjam.no_wa,
      "Tanggal Mulai": pinjam.tgl_mulai,
      "Tanggal Selesai": pinjam.tgl_selesai,
      Alasan: pinjam.alasan,
      Status: pinjam.status,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(workbook, worksheet, "data sedang dipinjam");
    worksheet["!cols"] = [
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 100 },
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 200 },
      { wpx: 100 },
    ];
    XLSX.writeFile(workbook, `aset-sedang-dipinjam.xlsx`);
  };

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
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearch />
          </label>
          <button
            className="btn btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:border-orange-500"
            onClick={handleExportFile}
          >
            <TbFileExport size={20} />
            Ekspor File
          </button>
        </div>
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
    </>
  );
}
