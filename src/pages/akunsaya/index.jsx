import Navbar from "@/components/navbar";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";
import Modal from "@/components/modal";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import ModalLoading from "@/components/modalLoading";

export default function PageAkunSaya() {
  const [tokenCookie, setTokenCookie] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const router = useRouter();

  // ubah data diri
  const [ubahDataDiri, setUbahDataDiri] = useState(false);
  const [usernameKaryawan, setUsernameKaryawan] = useState(null);
  const [namaKaryawan, setNamaKaryawan] = useState(null);
  const [waKaryawan, setWaKaryawan] = useState(null);
  const [alamatKaryawan, setAlamatKaryawan] = useState(null);

  const handleUbahDataDiri = () => {
    setUbahDataDiri(true);
    setUsernameKaryawan(users.username);
    setNamaKaryawan(users.nama_lengkap);
    setWaKaryawan(users.no_wa);
    setAlamatKaryawan(users.alamat);
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoadingModal(true);
          const res = await fetch("/api/akunKaryawan", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "apikey": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: JSON.stringify({
              updatedId: users.id,
              updatedUsername: usernameKaryawan,
              updatedWa: waKaryawan,
              updatedNama: namaKaryawan,
              updatedAlamat: alamatKaryawan,
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
            fetchData();
            setLoadingModal(false);
            setUbahDataDiri(false);
          } else if (res.status == 409) {
            Swal.fire({
              title: "Gagal",
              text: result.error,
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
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
          setUbahDataDiri(false);
        }
      }
    });
  };

  // ubah password
  const [ubahPassword, setUbahPassword] = useState(false);
  const [passwordBaru, setPasswordBaru] = useState(null);
  const [ulangPassword, setUlangPassword] = useState(null);
  const [tidakSesuai, setTidakSesuai] = useState(false);

  const handleUbahPassword = () => {
    setUbahPassword(true);
  };
  const handleCloseUbahPassword = () => {
    setUbahPassword(false);
    setPasswordBaru("");
    setUlangPassword("");
  };
  const handleSubmitUbahPassword = (event) => {
    event.preventDefault();
    if (ulangPassword !== passwordBaru) {
      setTidakSesuai(true);
    } else {
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLoadingModal(true);
            const res = await fetch("/api/passwordKaryawan", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "apikey": process.env.NEXT_PUBLIC_API_KEY,
              },
              body: JSON.stringify({
                updatedId: users.id,
                updatedPassword: ulangPassword,
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
              fetchData();
            } else if (res.status == 409) {
              Swal.fire({
                title: "Gagal",
                text: result.error,
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
              });
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
            setUbahPassword(false);
            setPasswordBaru("");
            setUlangPassword("");
            setTidakSesuai(false);
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error,
              icon: "error",
              showConfirmButton: false,
              timer: 10000,
            });
            setLoadingModal(false);
            setUbahPassword(false);
            setPasswordBaru("");
            setUlangPassword("");
            setTidakSesuai(false);
          }
        }
      });
    }
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

      if (res.status !== 200 || data.role !== "karyawan") {
        data.role == "admin" || data.role == "superadmin"
          ? router.push("/admin/konfirmasi")
          : router.push("/");
      } else {
        setTokenCookie(data);
      }
    };

    checkAuth();
  }, [router]);

  // fetch data diri
  const [users, setUsers] = useState({});
  const [error, setError] = useState(null);
  useEffect(() => {
    if (tokenCookie) {
      fetchData();
    }
  }, [tokenCookie]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/akunKaryawan", {
        method: "GET",
        headers: {
          "apikey": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      const filteredData = data.find((user) => user.id === tokenCookie.id);
      setUsers(filteredData);
    } catch (error) {
      setError(error);
    }
  };

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
                value={usernameKaryawan}
                onChange={(e) => setUsernameKaryawan(e.target.value)}
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
                value={namaKaryawan}
                onChange={(e) => setNamaKaryawan(e.target.value)}
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
                value={waKaryawan}
                onChange={(e) => setWaKaryawan(e.target.value)}
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
                onChange={(e) => setAlamatKaryawan(e.target.value)}
                required
              >
                {alamatKaryawan}
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
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
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
                value={ulangPassword}
                onChange={(e) => setUlangPassword(e.target.value)}
                required
              />
            </label>
            {tidakSesuai && (
              <p className="text-red-500">Password tidak sesuai !</p>
            )}
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

      {/* Modal Loading */}
      {loadingModal && <ModalLoading />}
    </>
  );
}
