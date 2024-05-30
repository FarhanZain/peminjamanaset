import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blankUsername, setBlankUsername] = useState("");
  const [blankPassword, setBlankPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
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
      router.push("/beranda");
    }
  };

  return (
    <>
      <Head>
        <title>Aplikasi Peminjaman Aset Ulil Albab Batam</title>
      </Head>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen overflow-hidden">
        <div className="hidden bg-[#FFEDD5] lg:flex justify-center items-center">
          <Image
            src="/image/illustration.png"
            alt="Ilustrasi"
            width={600}
            height={600}
          />
        </div>

        {/* Form Login */}
        <div className="flex justify-center items-center mx-6 lg:mx-0">
          <form onSubmit={handleSubmit} className="max-w-md w-full" action="">
            {/* Logo */}
            <div className="flex justify-center mb-5">
              <Image
                src="/image/logo.png"
                alt="Logo"
                width={150}
                height={150}
              />
            </div>
            {/* Text */}
            <h3 className="text-xl lg:text-2xl font-bold text-center mb-5">
              Masuk ke akun anda
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
            <button
              type="submit"
              className="btn w-full text-white bg-orange-500 hover:bg-orange-600"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
