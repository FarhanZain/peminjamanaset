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
import { useRouter } from "next/router";
import { CiImageOff } from "react-icons/ci";
import ModalLoading from "@/components/modalLoading";

export default function AdminDataAset() {
  const [loadingModal, setLoadingModal] = useState(false);
  const [userUnit, setUserUnit] = useState(null);

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
      selector: (row) => row.no_aset,
      sortable: true,
      wrap: true,
      width: "120px",
    },
    {
      name: "Nama Aset",
      selector: (row) => row.nama,
      sortable: true,
      wrap: true,
      minWidth: "140px",
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Lokasi",
      selector: (row) => row.lokasi,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Gambar",
      cell: (row) =>
        row.gambar == null ? (
          <div className="w-20 h-20 flex justify-center items-center bg-slate-100 my-2 rounded-lg">
            <CiImageOff size={32} />
          </div>
        ) : (
          <img
            className="w-20 h-20 my-2 object-cover"
            src={`../${row.gambar}`}
          />
        ),
      sortable: true,
      wrap: true,
      minWidth: "120px",
    },
    {
      name: "Kategori",
      selector: (row) => row.kategori,
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Status",
      cell: (row) => (
        <p
          className={`${
            row.status_aset == "Tersedia" ? "text-success" : "text-error"
          }`}
        >
          {row.status_aset}
        </p>
      ),
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Aksi",
      button: true,
      minWidth: "210px",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="btn btn-outline btn-info btn-sm"
            onClick={() => handleEditStatus(row)}
          >
            Status
          </button>
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

  // fetch data aset
  const [asets, setAsets] = useState([]);
  const [units, setUnits] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [error, setError] = useState(null);
  // filter
  const [filterKategori, setFilterKategori] = useState("");

  useEffect(() => {
    fetchData();
    fetchDataUnit();
    fetchDataKategori();
  }, [filterKategori]);
  const fetchData = async () => {
    try {
      const res = await fetch("/api/aset", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      const filterData = data.filter((item) => item.kategori === filterKategori);
      if (filterKategori) {
        setAsets(filterData);
      }else{
        setAsets(data);
      }
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
  const fetchDataKategori = async () => {
    try {
      const res = await fetch("/api/kategori", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      setKategoris(data);
    } catch (error) {
      setError(error);
    }
  };

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAsets, setFilteredAsets] = useState([]);
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filteredData = asets.filter(
        (aset) =>
          aset.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          aset.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          aset.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          aset.no_aset.toString().includes(searchTerm)
      );
      setFilteredAsets(filteredData);
    } else {
      setFilteredAsets(asets); // Tampilkan semua data jika pencarian kosong atau kurang dari 2 huruf
    }
  }, [searchTerm, asets]);

  // Hapus Data
  function handleActionHapus(row) {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menghapus aset : ${row.no_aset} - ${row.nama}`,
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
          const formData = new FormData();
          formData.append("deletedId", row.id);

          setLoadingModal(true);
          const res = await fetch("/api/aset", {
            method: "DELETE",
            headers: {
              "apikey": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: formData,
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
          } else if (res.status == 500) {
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
  }

  // Impor Data
  const [importAset, setImportAset] = useState(false);
  const [file, setFile] = useState(null);

  const handleImportAset = () => {
    setImportAset(true);
  };
  const handleCloseImportAset = () => {
    setImportAset(false);
  };
  const handleSubmitImportAset = async (event) => {
    event.preventDefault();
    setLoadingModal(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/importAset", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log(result);
      if (res.status == 200) {
        Swal.fire({
          title: "Berhasil",
          text: result.message,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        fetchData();
        setImportAset(false);
        setFile(null);
      } else {
        Swal.fire({
          title: "Gagal",
          text: result.error,
          icon: "error",
          showConfirmButton: false,
        });
        setImportAset(false);
        setFile(null);
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
      setImportAset(false);
      setLoadingModal(false);
    }
  };

  // Tambah Data by Form
  const [addByForm, setAddByForm] = useState(false);
  const [nomorAset, setNomorAset] = useState(null);
  const [namaAset, setNamaAset] = useState(null);
  const [unitAset, setUnitAset] = useState(null);
  const [lokasiAset, setLokasiAset] = useState(null);
  const [gambarAset, setGambarAset] = useState(null);
  const [kategoriAset, setKategoriAset] = useState(null);
  const [detailAset, setDetailAset] = useState(null);

  const handleAddByForm = () => {
    setAddByForm(true);
    setUnitAset(
      userUnit == null
        ? units[0].id
        : units.find((un) => un.unit === userUnit).id
    );
    setKategoriAset(kategoris[0].id);
  };
  const handleCloseAddByForm = () => {
    setAddByForm(false);
    setNomorAset("");
    setNamaAset("");
    setUnitAset(
      userUnit == null
        ? units[0].id
        : units.find((un) => un.unit === userUnit).id
    );
    setLokasiAset("");
    setGambarAset(null);
    setDetailAset("");
    setKategoriAset(kategoris[0].id);
  };
  const handleSubmitAddByForm = async (event) => {
    event.preventDefault();
    setLoadingModal(true);
    try {
      const formData = new FormData();
      formData.append("nomorAset", nomorAset);
      formData.append("namaAset", namaAset);
      formData.append("unitAset", unitAset);
      formData.append("lokasiAset", lokasiAset);
      formData.append("gambarAset", gambarAset);
      formData.append("kategoriAset", kategoriAset);
      formData.append("detailAset", detailAset);

      const res = await fetch("/api/aset", {
        method: "POST",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: formData,
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
        setAddByForm(false);
        setNomorAset("");
        setNamaAset("");
        setUnitAset(
          userUnit == null
            ? units[0].id
            : units.find((un) => un.unit === userUnit).id
        );
        setLokasiAset("");
        setGambarAset(null);
        setDetailAset("");
        setKategoriAset(kategoris[0].id);
      } else {
        Swal.fire({
          title: "Gagal",
          text: result.error,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        setAddByForm(false);
        setNomorAset("");
        setNamaAset("");
        setUnitAset(
          userUnit == null
            ? units[0].id
            : units.find((un) => un.unit === userUnit).id
        );
        setLokasiAset("");
        setGambarAset(null);
        setDetailAset("");
        setKategoriAset(kategoris[0].id);
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
      setAddByForm(false);
      setLoadingModal(false);
    }
  };

  // Tambah Data by QR
  const [addByQR, setAddByQR] = useState(false);
  const handleAddByQR = () => {
    setAddByQR(true);
  };
  const handleCloseAddByQR = () => {
    setAddByQR(false);
  };

  // Edit Data
  const [editByForm, setEditByForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNomor, setEditNomor] = useState(null);
  const [editNama, setEditNama] = useState(null);
  const [editUnit, setEditUnit] = useState(null);
  const [editLokasi, setEditLokasi] = useState(null);
  const [editGambar, setEditGambar] = useState(null);
  const [editKategori, setEditKategori] = useState(null);
  const [editDetail, setEditDetail] = useState(null);

  const handleEditByForm = (row) => {
    setEditByForm(true);
    setEditId(row.id);
    setEditNomor(row.no_aset);
    setEditNama(row.nama);
    setEditUnit(row.id_unit);
    setEditLokasi(row.lokasi);
    setEditKategori(row.id_kategori);
    setEditDetail(row.detail);
  };
  const handleCloseEditByForm = () => {
    setEditByForm(false);
  };
  const handleSubmitEditByForm = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin merubah data aset`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#FF5861",
      cancelButtonColor: "#d9d9d9",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingModal(true);
        try {
          const formData = new FormData();
          formData.append("updatedId", editId);
          formData.append("updatedNomor", editNomor);
          formData.append("updatedNama", editNama);
          formData.append("updatedUnit", editUnit);
          formData.append("updatedLokasi", editLokasi);
          formData.append("updatedGambar", editGambar);
          formData.append("updatedKategori", editKategori);
          formData.append("updatedDetail", editDetail);

          const res = await fetch("/api/aset", {
            method: "PUT",
            headers: {
              "apikey": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: formData,
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
            setEditByForm(false);
            setEditGambar(null);
          } else {
            Swal.fire({
              title: "Gagal",
              text: result.error,
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
            setEditByForm(false);
            setEditGambar(null);
          }
          setLoadingModal(false);
          setEditGambar(null);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error,
            icon: "error",
            showConfirmButton: false,
            timer: 10000,
          });
          setEditByForm(false);
          setLoadingModal(false);
          setEditGambar(null);
        }
      }
    });
  };

  // Edit Status
  const [editStatus, setEditStatus] = useState(false);
  const [editIdStatus, setEditIdStatus] = useState(null);
  const [editStatusAset, setEditStatusAset] = useState(null);

  const handleEditStatus = (row) => {
    setEditStatus(true);
    setEditIdStatus(row.id);
    setEditStatusAset(row.status_aset);
  };
  const handleCloseEditStatus = () => {
    setEditStatus(false);
  };
  const handleSubmitEditStatus = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin merubah status aset`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#FF5861",
      cancelButtonColor: "#d9d9d9",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingModal(true);
        try {
          const formData = new FormData();
          formData.append("updatedId", editIdStatus);
          formData.append("updatedStatus", editStatusAset);

          const res = await fetch("/api/aset", {
            method: "PATCH",
            headers: {
              "apikey": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: formData,
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
            setEditStatus(false);
          } else {
            Swal.fire({
              title: "Gagal",
              text: result.error,
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
            setEditStatus(false);
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
          setEditStatus(false);
          setLoadingModal(false);
        }
      }
    });
  };

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
        <title>Data Aset</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Data Aset</h1>
        <div className="flex flex-col gap-2 md:flex-row md:justify-between mt-4">
          <div className="flex flex-col lg:flex-row gap-2">
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
            {/* Filter Kategori */}
            <select className="select select-bordered w-full lg:w-[300px]" 
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {kategoris.map((ktgri) => (
                <option key={ktgri.id} value={ktgri.kategori}>
                  {ktgri.kategori}
                </option>
              ))}
            </select>
          </div>
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
              data={filteredAsets}
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
              onChange={(e) => setFile(e.target.files[0])}
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
                type="text"
                placeholder="Masukkan nomor aset"
                className="input input-bordered w-full"
                defaultValue={nomorAset}
                onChange={(e) => setNomorAset(e.target.value)}
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
                defaultValue={namaAset}
                onChange={(e) => setNamaAset(e.target.value)}
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
                defaultValue={unitAset}
                onChange={(e) => setUnitAset(e.target.value)}
                required
              >
                {userUnit
                  ? units
                      .filter((un) => un.unit === userUnit)
                      .map((un) => (
                        <option key={un.id} value={un.id}>
                          {un.unit}
                        </option>
                      ))
                  : units.map((un) => (
                      <option key={un.id} value={un.id}>
                        {un.unit}
                      </option>
                    ))}
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
                defaultValue={lokasiAset}
                onChange={(e) => setLokasiAset(e.target.value)}
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
                onChange={(e) => setGambarAset(e.target.files[0])}
              />
            </label>
            {/* Kategori Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Kategori Aset</span>
              </div>
              <select
                className="select select-bordered"
                defaultValue={kategoriAset}
                onChange={(e) => setKategoriAset(e.target.value)}
                required
              >
                {kategoris.map((ktgri) => (
                  <option key={ktgri.id} value={ktgri.id}>
                    {ktgri.kategori}
                  </option>
                ))}
              </select>
            </label>
            {/* Detail Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Detail Aset</span>
              </div>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Masukkan Detail Aset"
                defaultValue={detailAset}
                onChange={(e) => setDetailAset(e.target.value)}
                required
              ></textarea>
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
      {editByForm && (
        <Modal title="Edit Aset" onCloseModal={handleCloseEditByForm}>
          <form className="mt-4" action="" onSubmit={handleSubmitEditByForm}>
            {/* Nomor Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Nomor Aset</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan nomor aset"
                className="input input-bordered w-full"
                value={editNomor}
                onChange={(e) => setEditNomor(e.target.value)}
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
                value={editNama}
                onChange={(e) => setEditNama(e.target.value)}
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
                value={editUnit}
                onChange={(e) => setEditUnit(e.target.value)}
                required
              >
                {userUnit
                  ? units
                      .filter((un) => un.unit === userUnit)
                      .map((un) => (
                        <option key={un.id} value={un.id}>
                          {un.unit}
                        </option>
                      ))
                  : units.map((un) => (
                      <option key={un.id} value={un.id}>
                        {un.unit}
                      </option>
                    ))}
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
                onChange={(e) => setEditLokasi(e.target.value)}
                required
              >
                {editLokasi}
              </textarea>
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
                onChange={(e) => setEditGambar(e.target.files[0])}
              />
            </label>
            {/* Kategori Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Kategori Aset</span>
              </div>
              <select
                className="select select-bordered"
                defaultValue={editKategori}
                onChange={(e) => setEditKategori(e.target.value)}
                required
              >
                {kategoris.map((ktgri) => (
                  <option key={ktgri.id} value={ktgri.id}>
                    {ktgri.kategori}
                  </option>
                ))}
              </select>
            </label>
            {/* Detail Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Detail Aset</span>
              </div>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Masukkan Detail Aset"
                onChange={(e) => setEditDetail(e.target.value)}
                required
              >
                {editDetail}
              </textarea>
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

      {/* Modal Edit Status */}
      {editStatus && (
        <Modal title="Edit Status" onCloseModal={handleCloseEditStatus}>
          <form className="mt-4" action="" onSubmit={handleSubmitEditStatus}>
            {/* Status Aset */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Kategori Aset</span>
              </div>
              <select
                className="select select-bordered"
                defaultValue={editStatusAset}
                onChange={(e) => setEditStatusAset(e.target.value)}
                required
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Tidak Tersedia">Tidak Tersedia</option>
                <option value="Sedang Perbaikan">Sedang Perbaikan</option>
                <option value="Rusak">Rusak</option>
              </select>
            </label>
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

      {/* Modal Add Aset By QR */}
      {addByQR && (
        <Modal title="Tambah Aset by QR" onCloseModal={handleCloseAddByQR}>
          <Scanner
            onScan={(result) => {
              // Cek jika result adalah array dan memiliki setidaknya satu objek dengan rawValue
              if (
                Array.isArray(result) &&
                result.length === 1 &&
                result[0]?.rawValue
              ) {
                // Ambil rawValue dari objek pertama dalam array
                const scanResult = result[0].rawValue;

                const inputQR = scanResult.split(",");

                const textNomor = inputQR[0];
                const textNama = inputQR[1];
                const textUnit = inputQR[2];
                const textLokasi = inputQR[3];

                if (inputQR.length === 4) {
                  setAddByQR(false);
                  setNomorAset(textNomor);
                  setNamaAset(textNama);
                  setUnitAset(textUnit);
                  setLokasiAset(textLokasi);
                  setAddByForm(true);
                } else {
                  Swal.fire({
                    title: "Scan Gagal",
                    text: "QR code tidak terbaca, coba lagi.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  setAddByQR(false);
                }
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

      {/* Modal Loading */}
      {loadingModal && <ModalLoading />}
    </>
  );
}
