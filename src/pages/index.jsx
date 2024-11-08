import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import Swal from "sweetalert2";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blankUsername, setBlankUsername] = useState("");
  const [blankPassword, setBlankPassword] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setBlankUsername("Silahkan masukkan username !");
    } else {
      setBlankUsername("");
    }
    if (!password) {
      setBlankPassword("Silahkan masukkan password !");
    } else {
      setBlankPassword("");
    }
    if (username && password) {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.NEXT_PUBLIC_API_KEY,
          },
          body: JSON.stringify({ username, password }),
        });

        setLoadingBtn(true);

        const data = await res.json();

        if (res.status === 200) {
          if (data.data.role === "karyawan" && data.data.status === "Aktif") {
            router.push("/beranda");
          } else if (
            data.data.role === "admin" &&
            data.data.status === "Aktif"
          ) {
            router.push("/admin/konfirmasi");
          } else if (
            data.data.role === "superadmin" &&
            data.data.status === "Aktif"
          ) {
            router.push("/admin/konfirmasi");
          }

          if (data.data.status === "Tidak Aktif") {
            setUsername("");
            setPassword("");
            setLoadingBtn(false);
            Swal.fire({
              title: "Login Gagal",
              text: "Akun anda dinon-aktifkan",
              icon: "error",
              showConfirmButton: false,
              timer: 5000,
            });
          }
        } else if (res.status === 401) {
          data.message == "Username Salah !"
            ? setBlankUsername(data.message)
            : setBlankPassword(data.message);

          setLoadingBtn(false);
        }
      } catch (error) {
        Swal.fire({
          title: "Login Gagal",
          text: error,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/check-auth");
      const data = await res.json();

      if (res.status === 200) {
        // Arahkan berdasarkan role
        if (data.role === "karyawan") {
          router.push("/beranda");
        } else if (data.role === "admin" || data.role === "superadmin") {
          router.push("/admin/konfirmasi");
        }
      }
    };

    checkAuth();
  }, [router]);

  return (
    <>
      <Head>
        <title>Aplikasi Peminjaman Aset Ulil Albab Batam</title>
      </Head>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen overflow-hidden">
        <div className="hidden bg-[#FFEDD5] lg:flex justify-center items-center">
          <img src="/image/illustration.png" alt="Ilustrasi" className="w-auto h-auto"/>
        </div>

        {/* Form Login */}
        <div className="flex justify-center items-center mx-6 lg:mx-0">
          <form onSubmit={handleSubmit} className="max-w-md w-full" action="">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/image/logo.png" alt="logo" className="w-[150px] h-[150px]" />
            </div>
            {/* Text */}
            <h3 className="text-xl lg:text-2xl font-bold text-center mb-6">
              Peminjaman Aset Ulil Albab Batam
            </h3>
            {/* Username */}
            <label className="form-control w-full max-w-md mb-3">
              <span className="mb-1 text-sm lg:text-base">Username</span>
              <input
                type="text"
                placeholder="Username123"
                className="input input-bordered input-md w-full max-w-md focus:outline focus:outline-orange-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              {/* Error message */}
              {blankUsername && (
                <p className="text-red-500 mt-1">{blankUsername}</p>
              )}
            </label>
            {/* Password */}
            <label className="form-control w-full max-w-md mb-8">
              <span className="mb-1 text-sm lg:text-base">Password</span>
              <input
                type="password"
                placeholder="Password123"
                className="input input-bordered input-md w-full max-w-md focus:outline focus:outline-orange-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Error message */}
              {blankPassword && (
                <p className="text-red-500 mt-1">{blankPassword}</p>
              )}
            </label>
            {/* Submit */}
            {loadingBtn ? (
              <button
                type="button"
                className="btn w-full text-white bg-orange-500 hover:bg-orange-600"
              >
                <span className="loading loading-spinner"></span>
                loading
              </button>
            ) : (
              <button
                type="submit"
                className="btn w-full text-white bg-orange-500 hover:bg-orange-600"
              >
                Masuk
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
