import Navbar from "@/components/navbar";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";
import Modal from "@/components/modal";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function PageAkunSaya() {
  // const [tokenCookie, setTokenCookie] = useState(null);
  const [users, setUsers] = useState({});
  const [error, setError] = useState(null);
  const [ubahDataDiri, setUbahDataDiri] = useState(null);
  const [ubahPassword, setUbahPassword] = useState(false);
  const router = useRouter();
  let tokenCookie;

  // ubah data diri
  const handleChangeValue = (event) => {
    setUbahDataDiri(event.target.value);
  };
  const handleUbahDataDiri = () => {
    setUbahDataDiri({
      username: users.username,
      namaLengkap: users.nama_lengkap,
      nomorWA: users.no_wa,
      alamat: users.alamat,
    });
  };
  const handleCloseUbahDataDiri = () => {
    setUbahDataDiri(null);
  };
  const handleSubmitUbahDataDiri = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin merubah data diri`,
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
          text: "Data diri sudah diperbarui.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        setUbahDataDiri(null);
      }
    });
  };

  // ubah password
  const handleUbahPassword = () => {
    setUbahPassword(true);
  };
  const handleCloseUbahPassword = () => {
    setUbahPassword(false);
  };
  const handleSubmitUbahPassword = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin merubah password`,
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
          text: "Password sudah diperbarui.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        setUbahPassword(false);
      }
    });
  };

  // logout
  const handleLogout = () => {
    Swal.fire({
      title: "Apakah kamu ingin keluar ?",
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
        fetch("/api/logout", { method: "POST" });
        router.push("/");
      }
    });
  };

  // akses page lain ketika belum login atau tidak login sebagai karyawan
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/check-auth");
      const data = await res.json();
      tokenCookie = data;

      if (res.status !== 200 || data.role !== "karyawan") {
        data.role == "admin" || data.role == "superadmin"
          ? router.push("/admin/konfirmasi")
          : router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  // fetch data diri
  useEffect(() => {
    // Fetch data dari API route
    fetch("/api/akunKaryawan")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.find((user) => user.id === tokenCookie.id);
        setUsers(filteredData); // Menyimpan data ke state
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Akun Saya</title>
      </Head>
      <Navbar />
      <div className="container px-6 mx-auto my-20 lg:my-24 lg:px-12">
        <div className="flex flex-col items-center">
          {/* Data Diri Title */}
          <h1 className="mt-4 text-2xl md:text-3xl font-bold">Data Diri</h1>

          {/* Table */}
          <div className="mt-5 md:mt-10 flex flex-col items-center">
            <table className="table">
              <tbody>
                <tr>
                  <th>Username</th>
                  <td>{users.username}</td>
                </tr>
                <tr>
                  <th>Nama Lengkap</th>
                  <td>{users.nama_lengkap}</td>
                </tr>
                <tr>
                  <th>Nomor WA</th>
                  <td>{users.no_wa}</td>
                </tr>
                <tr>
                  <th>Alamat</th>
                  <td>{users.alamat}</td>
                </tr>
              </tbody>
            </table>
            <button
              className="btn btn-sm btn-ghost text-orange-500 hover:bg-orange-50 mt-2 md:mt-4"
              onClick={handleUbahDataDiri}
            >
              <TbEdit size={20} />
              Ubah Data Diri
            </button>
          </div>

          {/* Button ganti password dan logout */}
          <div className="flex gap-5 mt-5 md:mt-16">
            <button
              className="btn btn-outline border-orange-500 text-orange-500 hover:border-orange-500 hover:bg-orange-500"
              onClick={handleUbahPassword}
            >
              <RiLockPasswordLine size={20} />
              Ganti Password
            </button>
            <button
              className="btn bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleLogout}
            >
              <BiLogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Modal Ubah Data Diri */}
      {ubahDataDiri && (
        <Modal title="Ubah Data Diri" onCloseModal={handleCloseUbahDataDiri}>
          <form className="mt-4" action="" onSubmit={handleSubmitUbahDataDiri}>
            {/* Username */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan username"
                className="input input-bordered w-full"
                value={ubahDataDiri.username}
                onChange={handleChangeValue}
                required
              />
            </label>
            {/* Nama Lengkap */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Nama Lengkap</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                className="input input-bordered w-full"
                value={ubahDataDiri.namaLengkap}
                onChange={handleChangeValue}
                required
              />
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
                value={ubahDataDiri.nomorWA}
                onChange={handleChangeValue}
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
                placeholder="Masukkan alamat"
                onChange={handleChangeValue}
                required
              >
                {ubahDataDiri.alamat}
              </textarea>
            </label>
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseUbahDataDiri}>
                Batal
              </button>
              <button
                className="btn bg-orange-500 text-white hover:bg-orange-600"
                type="submit"
              >
                Ubah
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Ubah Password */}
      {ubahPassword && (
        <Modal title="Ubah Data Diri" onCloseModal={handleCloseUbahPassword}>
          <form className="mt-4" action="" onSubmit={handleSubmitUbahPassword}>
            {/* Password baru */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password Baru</span>
              </div>
              <input
                type="password"
                placeholder="Masukkan Password"
                className="input input-bordered w-full"
                required
              />
            </label>
            {/* Ketik ulang password baru */}
            <label className="form-control w-full mt-2">
              <div className="label">
                <span className="label-text">Ketik Ulang Password Baru</span>
              </div>
              <input
                type="password"
                placeholder="Masukkan Password Ulang"
                className="input input-bordered w-full"
                required
              />
            </label>
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseUbahPassword}>
                Batal
              </button>
              <button
                className="btn bg-orange-500 text-white hover:bg-orange-600"
                type="submit"
              >
                Ubah
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
