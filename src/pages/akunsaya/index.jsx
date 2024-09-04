import Navbar from "@/components/navbar";
import Head from "next/head";
import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";
import Modal from "@/components/modal";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function PageAkunSaya() {
  const [ubahFoto, setUbahFoto] = useState(false);
  const [ubahDataDiri, setUbahDataDiri] = useState(null);
  const [ubahPassword, setUbahPassword] = useState(false);
  const router = useRouter();

  const handleUbahFoto = () => {
    setUbahFoto(true);
  };

  const handleCloseUbahFoto = () => {
    setUbahFoto(false);
  };

  const handleSubmitUbahFoto = (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Apakah kamu yakin ?",
      text: `ingin merubah foto`,
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
          text: "Foto sudah diperbarui.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        setUbahFoto(false);
      }
    });
  };

  const handleUbahDataDiri = () => {
    setUbahDataDiri({
      username: "farhanzain123",
      namaLengkap: "Farhan Abdurrahman Zain",
      nomorWA: "081234567890",
      alamat: "Perum Mekarsar Blok D 100 Tiban Lama, Sekupang, Batam",
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
        router.push("/");
      }
    });
  };

  return (
    <>
      <Head>
        <title>Akun Saya</title>
      </Head>
      <Navbar />
      <div className="container px-6 mx-auto my-20 lg:my-24 lg:px-12">
        <div className="flex flex-col items-center">
          {/* Foto */}
          <div className="flex flex-col items-center gap-2">
            <div className="avatar">
              <div className="w-28 md:w-40 rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="Foto Profil"
                />
              </div>
            </div>
            <button
              className="btn btn-sm btn-ghost text-orange-500 hover:bg-orange-50"
              onClick={handleUbahFoto}
            >
              <TbEdit size={20} />
              Ubah Foto
            </button>
          </div>

          {/* Table */}
          <div className="mt-5 md:mt-10 flex flex-col items-center">
            <table className="table">
              <tbody>
                <tr>
                  <th>Username</th>
                  <td>farhanzain123</td>
                </tr>
                <tr>
                  <th>Nama Lengkap</th>
                  <td>Farhan Abdurrahman Zain</td>
                </tr>
                <tr>
                  <th>Nomor WA</th>
                  <td>081234567890</td>
                </tr>
                <tr>
                  <th>Alamat</th>
                  <td>
                    Perum Mekarsari Blok D 100 Tiban Lama, Sekupang, Batam
                  </td>
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

      {/* Modal Ubah Foto */}
      {ubahFoto && (
        <Modal title="Ubah Foto" onCloseModal={handleCloseUbahFoto}>
          <form className="mt-4" action="" onSubmit={handleSubmitUbahFoto}>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              required
            />
            <p className="mt-2 text-error">*Masukkan foto terbaru</p>
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseUbahFoto}>
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
