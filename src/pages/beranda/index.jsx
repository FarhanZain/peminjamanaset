import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import CardBeranda from "@/components/cardBeranda";
import Navbar from "@/components/navbar";
import Head from "next/head";

export default function PageBeranda() {
  return (
    <>
      <Head>
        <title>Beranda</title>
      </Head>
      <Navbar />
      <div className="container px-6 mx-auto my-20 lg:my-24 lg:px-12">
        <div>
          <div className="grid grid-cols-1 gap-3 mb-3 lg:grid-cols-3 lg:gap-4">
            {/* Input Search */}
            <label className="flex items-center w-full gap-2 rounded-xl input input-bordered lg:mb-4">
              <input type="text" className="grow" placeholder="Cari" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            {/* Filter Unit */}
            <select className="w-full rounded-xl select select-bordered">
              <option selected>Semua Unit</option>
              <option>Unit Yayasan</option>
              <option>Unit SMA</option>
              <option>Unit SMP</option>
              <option>Unit SD</option>
              <option>Unit TK</option>
            </select>
            {/* Filter Status */}
            <select className="w-full rounded-xl select select-bordered">
              <option selected>Semua Status</option>
              <option>Tersedia</option>
              <option>Tidak Tersedia</option>
            </select>
          </div>
          {/* Card Item Aset */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
            <CardBeranda
              fotoAset="/image/detailKamera.png"
              namaAset="Kamera Mirrorless"
              unitAset="Unit Yayasan"
              statusAset="Tersedia"
            ></CardBeranda>
            <CardBeranda
              fotoAset="/image/logo.png"
              namaAset="Speaker Portable"
              unitAset="Unit SD"
              statusAset="Tersedia"
            ></CardBeranda>
            <CardBeranda
              fotoAset="/image/logo.png"
              namaAset="Speaker Portable"
              unitAset="Unit SD"
              statusAset="Tersedia"
            ></CardBeranda>
            <CardBeranda
              fotoAset="/image/logo.png"
              namaAset="Speaker Portable"
              unitAset="Unit SD"
              statusAset="Tersedia"
            ></CardBeranda>
            <CardBeranda
              fotoAset="/image/logo.png"
              namaAset="Speaker Portable"
              unitAset="Unit SD"
              statusAset="Tersedia"
            ></CardBeranda>
          </div>
        </div>
      </div>
    </>
  );
}
