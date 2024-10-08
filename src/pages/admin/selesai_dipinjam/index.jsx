import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import DataTable from "react-data-table-component";
import { TbFileExport } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";

export default function AdminSelesaiDipinjam() {
  const formatTanggal = (tanggal) => {
    const format = new Date(tanggal).toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, 
    });
    return format;
  };

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
      name: "Tgl Kembali",
      cell: (row) => <p className={`${row.status_pinjam == "Dibatalkan" ? 'text-gray-300' : row.status_pinjam == "Ditolak" ? 'text-gray-300' : 'text-black'}`}>{formatTanggal(row.tgl_pengembalian)}</p>,
      sortable: true,
      wrap: true,
      width: "140px",
    },
    {
      name: "Nama Aset",
      selector: (row) => row.nama,
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
      sortable: true,
      wrap: true,
      width: "95px",
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
      selector: (row) => formatTanggal(row.tgl_mulai),
      sortable: true,
      wrap: true,
      width: "130px",
    },
    {
      name: "Tgl Selesai",
      selector: (row) => formatTanggal(row.tgl_selesai),
      sortable: true,
      wrap: true,
      width: "140px",
    },
    {
      name: "Keperluan",
      cell: (row) => <div style={{ padding: "8px 0" }}>{row.keperluan}</div>,
      sortable: true,
      wrap: true,
      minWidth: "200px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div
          className={`badge badge-outline ${
            row.status_pinjam == "Selesai" ? "badge-success" : "badge-error"
          }`}
        >
          {row.status_pinjam}
        </div>
      ),
      sortable: true,
      width: "135px",
    },
  ];

  // fetch data pinjam
  const [pinjams, setPinjams] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await fetch("/api/selesaiPinjam", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      setPinjams(data);
    } catch (error) {
      setError(error);
    }
  };

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
      "Tanggal Pengembalian": formatTanggal(pinjam.tgl_pengembalian),
      "Nama Aset": pinjam.nama,
      "Nama Peminjam": pinjam.nama_lengkap,
      "No Wa": pinjam.no_wa,
      "Tanggal Mulai": formatTanggal(pinjam.tgl_mulai),
      "Tanggal Selesai": formatTanggal(pinjam.tgl_selesai),
      Alasan: pinjam.alasan,
      Status: pinjam.status,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(workbook, worksheet, "data sedang dipinjam");
    worksheet["!cols"] = [
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 100 },
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 200 },
      { wpx: 100 },
    ];
    XLSX.writeFile(workbook, `aset-selesai-dipinjam.xlsx`);
  };

  // mounted
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Aset Selesai Dipinjam</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Aset Selesai Dipinjam</h1>
        <div className="flex flex-col lg:flex-row justify-between mt-4">
          <label className="input input-bordered flex items-center gap-2 w-full lg:w-[300px] mb-2 lg:mb-0">
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
