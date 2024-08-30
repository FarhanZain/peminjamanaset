import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { IoSearch } from "react-icons/io5";

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
    name: "Tgl Pengajuan",
    selector: (row) => row.tglPengajuan,
    sortable: true,
    width: "157px",
  },
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
    selector: (row) => row.alasan,
    sortable: true,
    wrap: true,
    minWidth: "200px",
  },
  {
    name: "Aksi",
    button: true,
    minWidth: "150px",
    cell: (row) => (
      <div className="flex gap-3">
        <button
          className="btn btn-outline btn-success btn-sm"
          onClick={() => handleActionSetuju(row.id)}
        >
          Setuju
        </button>
        <button
          className="btn btn-outline btn-error btn-sm"
          onClick={() => handleActionTolak(row.id)}
        >
          Tolak
        </button>
      </div>
    ),
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
  },
];

function handleActionSetuju(id) {
  Swal.fire({
    title: "Apakah kamu yakin ?",
    text: `ingin menyetujui peminjaman aset -- oleh ${id}`,
    icon: "warning",
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonColor: "#00A96E",
    cancelButtonColor: "#d9d9d9",
    confirmButtonText: "Setuju",
    cancelButtonText: "Batal",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Berhasil",
        text: "peminjaman telah disetujui.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
}

function handleActionTolak(id) {
  Swal.fire({
    title: "Apakah kamu yakin ?",
    text: `ingin menolak peminjaman aset -- oleh ${id}`,
    icon: "warning",
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonColor: "#FF5861",
    cancelButtonColor: "#d9d9d9",
    confirmButtonText: "Tolak",
    cancelButtonText: "Batal",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Berhasil",
        text: "peminjaman telah ditolak.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
}

export default function AdminKonfirmasi() {
  return (
    <>
      <Head>
        <title>Konfirmasi Peminjaman Aset</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Konfirmasi Peminjaman Aset</h1>
        <label className="input input-bordered flex items-center gap-2 w-[300px] mt-4">
          <input type="text" className="grow" placeholder="Search" />
          <IoSearch />
        </label>
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            pagination
          />
        </div>
      </DefaultLayout>
    </>
  );
}
