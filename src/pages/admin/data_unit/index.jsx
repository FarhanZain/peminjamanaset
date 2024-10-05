import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Modal from "@/components/modal";
import ModalLoading from "@/components/modalLoading";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoSearch } from "react-icons/io5";
import { TiPlus } from "react-icons/ti";
import Swal from "sweetalert2";

export default function AdminDataUnit() {
  const [loadingModal, setLoadingModal] = useState(false);

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
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
      sortable: true,
      wrap: true,
      minWidth: "150px",
    },
    {
      name: "Aksi",
      button: true,
      minWidth: "200px",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            className="btn btn-outline btn-warning btn-sm"
            onClick={() => handleEditUnit(row)}
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

  // Fetch Data Admin & Superadmin
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDataUnit();
  }, []);
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

  // Tambah Unit
  const [addUnit, setAddUnit] = useState(false);
  const [textUnit, setTextUnit] = useState("");

  const handleAddUnit = () => {
    setAddUnit(true);
  };
  const handleCloseAddUnit = () => {
    setAddUnit(false);
    setTextUnit("");
  };

  const handleSubmitAddUnit = async (event) => {
    event.preventDefault();
    setLoadingModal(true);
    try {
      const res = await fetch("/api/unit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ textUnit }),
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
        fetchDataUnit();
      } else {
        Swal.fire({
          title: "Gagal",
          text: result.error,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      setAddUnit(false);
      setLoadingModal(false);
      setTextUnit("");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        showConfirmButton: false,
        timer: 10000,
      });
      setAddUnit(false);
      setLoadingModal(false);
    }
  };

  // Edit Unit
  const [editUnit, setEditUnit] = useState(null);
  const [editTextUnit, setEditTextUnit] = useState(null);
  const handleEditUnit = (row) => {
    setEditUnit(row);
    setEditTextUnit(row.unit);
  };
  const handleCloseEditUnit = () => {
    setEditUnit(null);
  };
  const handleSubmitEditUnit = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin merubah unit ${editUnit.unit}`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#FF5861",
      cancelButtonColor: "#d9d9d9",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoadingModal(true);
          const res = await fetch("/api/unit", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "apikey": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: JSON.stringify({
              updatedId: editUnit.id,
              updatedUnit: editTextUnit,
            }),
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
            fetchDataUnit();
          } else {
            Swal.fire({
              title: "Gagal",
              text: result.error,
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          }
          setLoadingModal(false);
          setEditUnit(null);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error,
            icon: "error",
            showConfirmButton: false,
            timer: 10000,
          });
          setLoadingModal(false);
          setEditUnit(null);
        }
      }
    });
  };

  // Hapus Unit
  const handleActionHapus = (row) => {
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin menghapus unit ${row.unit}`,
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
          setLoadingModal(true);
          const res = await fetch("/api/unit", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "apikey": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: JSON.stringify({ deletedId: row.id }),
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
            fetchDataUnit();
          } else {
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
  };

  // akses page ketika belum login atau tidak login sebagai admin / superadmin
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/check-auth");
      const data = await res.json();
      if (res.status !== 200 || data.role !== "superadmin") {
        data.role == "karyawan"
          ? router.push("/beranda")
          : data.role == "admin"
          ? router.push("/admin/konfirmasi")
          : router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  // Search
  const [searchTerm, setSearchTerm] = useState(""); // State untuk input pencarian
  const [filteredUnits, setFilteredUnits] = useState([]);
  useEffect(() => {
    if (searchTerm.length >= 1) {
      const filteredData = units.filter(
        (unit) =>
          (unit.id?.toString() || "").includes(searchTerm) ||
          unit.unit.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUnits(filteredData);
    } else {
      setFilteredUnits(units);
    }
  }, [searchTerm, units]);

  // Mounted
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Data Unit</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Data Unit</h1>
        <div className="flex flex-col gap-2 md:flex-row md:justify-between mt-4">
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
          <div className="grid grid-cols-1 gap-2">
            <button
              className="btn bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleAddUnit}
            >
              <TiPlus size={24} />
              Unit
            </button>
          </div>
        </div>
        <div className="mt-4">
          {isMounted && (
            <DataTable
              columns={columns}
              data={filteredUnits}
              customStyles={customStyles}
              pagination
            />
          )}
        </div>
      </DefaultLayout>

      {/* Modal Add Unit */}
      {addUnit && (
        <Modal title="Tambah Unit" onCloseModal={handleCloseAddUnit}>
          <form className="mt-4" action="" onSubmit={handleSubmitAddUnit}>
            {/* Unit */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Nama Unit</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan nama unit"
                className="input input-bordered w-full"
                value={textUnit}
                onChange={(e) => setTextUnit(e.target.value)}
                required
              />
            </label>
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseAddUnit}>
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

      {/* Modal Edit Unit*/}
      {editUnit && (
        <Modal title="Edit Unit" onCloseModal={handleCloseEditUnit}>
          <form className="mt-4" action="" onSubmit={handleSubmitEditUnit}>
            <div className="form-control">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Nama Unit</span>
                </div>
                <input
                  type="text"
                  placeholder="Masukkan nama unit"
                  className="input input-bordered w-full"
                  value={editTextUnit}
                  onChange={(e) => setEditTextUnit(e.target.value)}
                  required
                />
              </label>
            </div>
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseEditUnit}>
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

      {/* Modal Loading */}
      {loadingModal && <ModalLoading />}
    </>
  );
}
