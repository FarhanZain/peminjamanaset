"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { useRouter } from "next/router";
import { HiOutlineQueueList } from "react-icons/hi2";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  // tampilkan menu jika superadmin
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/check-auth");
      const data = await res.json();
      if (res.status !== 200 || data.role !== "superadmin") {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    };
    checkAuth();
  }, [router]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-[9] flex h-screen w-72 flex-col overflow-y-hidden bg-orange-50 duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5 lg:py-6">
        <Link href="#">
          <Image
            width={32}
            height={32}
            src={"/image/logoaja.png"}
            alt="Logo"
            style={{
              width: "auto",
              height: "auto",
            }}
            priority
          />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block text-orange-500 lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        {/* <!-- Sidebar Menu --> */}
        <nav className="px-4 py-4 mt-3 2xl:mt-7 2xl:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-black">
              PEMINJAMAN
            </h3>

            <ul className="flex flex-col gap-2 mb-6">
              {/* <!-- Menu Item Dashboard --> */}
              {/* <SidebarLinkGroup
                activeCondition={
                  pathname === "/" || pathname.includes("dashboard")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-3 rounded-lg px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-orange-100 hover:rounded-lg ${
                          (pathname === "/admin/konfirmasi" ||
                            pathname.includes("dashboard")) &&
                          "bg-orange-100 text-orange-500"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                            fill=""
                          />
                        </svg>
                        Dashboard
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/" && "text-white"
                              }`}
                            >
                              eCommerce
                            </Link>
                          </li>
                        </ul>
                      </div>
                      
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> */}
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Konfirmasi Peminjaman --> */}
              <li>
                <Link
                  href="/admin/konfirmasi"
                  className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-orange-100 hover:rounded-lg ${
                    (pathname === "/admin/konfirmasi" ||
                      pathname.includes("dashboard")) &&
                    "bg-orange-100 text-orange-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none">
                      <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                      <path
                        fill="currentColor"
                        d="M5.436 16.72a1.466 1.466 0 0 1 1.22 2.275a1.466 1.466 0 0 1-1.22 2.275c-.65 0-1.163-.278-1.427-.901a.65.65 0 1 1 1.196-.508a.179.179 0 0 0 .165.109c.109 0 .23-.03.23-.167c0-.1-.073-.143-.156-.154l-.051-.004a.65.65 0 0 1-.096-1.293l.096-.007c.102 0 .207-.037.207-.158c0-.137-.12-.167-.23-.167a.179.179 0 0 0-.164.11a.65.65 0 1 1-1.197-.509c.264-.622.777-.9 1.427-.9ZM20 18a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2zM6.08 9.945a1.552 1.552 0 0 1 .43 2.442l-.554.593h.47a.65.65 0 1 1 0 1.3H4.573a.655.655 0 0 1-.655-.654c0-.207.029-.399.177-.557L5.559 11.5c.11-.117.082-.321-.06-.392c-.136-.068-.249.01-.275.142l-.006.059a.65.65 0 0 1-.65.65c-.39 0-.65-.327-.65-.697a1.482 1.482 0 0 1 2.163-1.317ZM20 11a1 1 0 0 1 .117 1.993L20 13H9a1 1 0 0 1-.117-1.993L9 11zM6.15 3.39v3.24a.65.65 0 1 1-1.3 0V4.522a.65.65 0 0 1-.46-1.183l.742-.495a.655.655 0 0 1 1.018.545ZM20 4a1 1 0 0 1 .117 1.993L20 6H9a1 1 0 0 1-.117-1.993L9 4z"
                      />
                    </g>
                  </svg>
                  Konfirmasi Peminjaman
                </Link>
              </li>
              {/* <!-- Menu Item Konfirmasi Peminjaman --> */}

              {/* <!-- Menu Item Sedang Dipinjam --> */}
              <li>
                <Link
                  href="/admin/sedang_dipinjam"
                  className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-orange-100 hover:rounded-lg ${
                    (pathname === "/admin/sedang_dipinjam" ||
                      pathname.includes("admin/sedang_dipinjam")) &&
                    "bg-orange-100 text-orange-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" fillRule="evenodd">
                      <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                      <path
                        fill="currentColor"
                        d="M7 13a2 2 0 0 1 1.995 1.85L9 15v3a2 2 0 0 1-1.85 1.995L7 20H4a2 2 0 0 1-1.995-1.85L2 18v-3a2 2 0 0 1 1.85-1.995L4 13zm9 4a1 1 0 0 1 .117 1.993L16 19h-4a1 1 0 0 1-.117-1.993L12 17zm-9-2H4v3h3zm13-2a1 1 0 1 1 0 2h-8a1 1 0 1 1 0-2zM7 3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm9 4a1 1 0 0 1 .117 1.993L16 9h-4a1 1 0 0 1-.117-1.993L12 7zM7 5H4v3h3zm13-2a1 1 0 0 1 .117 1.993L20 5h-8a1 1 0 0 1-.117-1.993L12 3z"
                      />
                    </g>
                  </svg>
                  Sedang Dipinjam
                </Link>
              </li>
              {/* <!-- Menu Item Sedang Dipinjam --> */}

              {/* <!-- Menu Item Selesai Dipinjam --> */}
              <li>
                <Link
                  href="/admin/selesai_dipinjam"
                  className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-orange-100 hover:rounded-lg ${
                    (pathname === "/admin/selesai_dipinjam" ||
                      pathname.includes("admin/selesai_dipinjam")) &&
                    "bg-orange-100 text-orange-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none">
                      <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                      <path
                        fill="currentColor"
                        d="M7.238 17.013a1 1 0 0 1 1.497 1.32l-.083.094l-2.298 2.298a1.25 1.25 0 0 1-1.666.09l-.102-.09l-1.237-1.238a1 1 0 0 1 1.32-1.497l.094.083l.707.707l1.768-1.768ZM20 18a1 1 0 0 1 0 2h-9a1 1 0 1 1 0-2zM8.652 10.012a1 1 0 0 1 0 1.415l-2.298 2.298a1.25 1.25 0 0 1-1.768 0l-1.237-1.238a1 1 0 1 1 1.414-1.414l.707.707l1.768-1.767a1 1 0 0 1 1.414 0ZM20 11a1 1 0 0 1 .117 1.993L20 13h-9a1 1 0 0 1-.116-1.993L11 11zM7.238 3.013a1 1 0 0 1 1.497 1.32l-.083.094l-2.298 2.298a1.25 1.25 0 0 1-1.666.09l-.102-.09l-1.237-1.238a1 1 0 0 1 1.32-1.497l.094.083l.707.707zM20 4a1 1 0 0 1 .117 1.993L20 6h-9a1 1 0 0 1-.116-1.993L11 4z"
                      />
                    </g>
                  </svg>
                  Selesai Dipinjam
                </Link>
              </li>
              {/* <!-- Menu Item Selesai Dipinjam --> */}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MASTER DATA
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Data Aset --> */}
              <li>
                <Link
                  href="/admin/data_aset"
                  className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-orange-100 hover:rounded-lg ${
                    (pathname === "/admin/data_aset" ||
                      pathname.includes("admin/data_aset")) &&
                    "bg-orange-100 text-orange-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                    >
                      <path d="M22 8v12c0 2.21-4.03 4-9 4s-9-1.79-9-4V8" />
                      <path d="M22 14c0 2.21-4.03 4-9 4s-9-1.79-9-4m18-6c0 2.21-4.03 4-9 4s-9-1.79-9-4s4.03-4 9-4s9 1.79 9 4m10-2h6a4 4 0 0 1 4 4v6M16 42h-6a4 4 0 0 1-4-4v-6m29 6v6m6 0H29m15-6V26H26v12z" />
                    </g>
                  </svg>
                  Data Aset
                </Link>
              </li>
              {/* <!-- Menu Item Data Aset --> */}
              {/* <!-- Menu Item Data Karyawan --> */}
              <li>
                <Link
                  href="/admin/data_karyawan"
                  className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-orange-100 hover:rounded-lg ${
                    (pathname === "/admin/data_karyawan" ||
                      pathname.includes("admin/data_karyawan")) &&
                    "bg-orange-100 text-orange-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                    >
                      <path d="M22 8v12c0 2.21-4.03 4-9 4s-9-1.79-9-4V8" />
                      <path d="M22 14c0 2.21-4.03 4-9 4s-9-1.79-9-4m18-6c0 2.21-4.03 4-9 4s-9-1.79-9-4s4.03-4 9-4s9 1.79 9 4m10-2h6a4 4 0 0 1 4 4v6M16 42h-6a4 4 0 0 1-4-4v-6" />
                      <circle cx="35" cy="29" r="5" />
                      <path d="M44 44H26a9 9 0 1 1 18 0" />
                    </g>
                  </svg>
                  Data Karyawan
                </Link>
              </li>
              {/* <!-- Menu Item Data Karyawan --> */}
              {showMenu && (
                <>
                  {/* Menu Item Data Admin */}
                  <li>
                    <Link
                      href="/admin/data_admin"
                      className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-orange-100 hover:rounded-lg ${
                        (pathname === "/admin/data_admin" ||
                          pathname.includes("admin/data_admin")) &&
                        "bg-orange-100 text-orange-500"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 48 48"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                        >
                          <path d="M39 28v4h-8v-4a4 4 0 0 1 8 0m-13 4h18v12H26zm6-26h6a4 4 0 0 1 4 4v6M16 42h-6a4 4 0 0 1-4-4v-6M22 8v12c0 2.21-4.03 4-9 4s-9-1.79-9-4V8" />
                          <path d="M22 14c0 2.21-4.03 4-9 4s-9-1.79-9-4m18-6c0 2.21-4.03 4-9 4s-9-1.79-9-4s4.03-4 9-4s9 1.79 9 4" />
                        </g>
                      </svg>
                      Data Admin
                    </Link>
                  </li>
                  {/* Menu Item Data Unit */}
                  <li>
                    <Link
                      href="/admin/data_unit"
                      className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-orange-100 hover:rounded-lg ${
                        (pathname === "/admin/data_unit" ||
                          pathname.includes("admin/data_unit")) &&
                        "bg-orange-100 text-orange-500"
                      }`}
                    >
                      <HiOutlineQueueList size={20} />
                      Data Unit
                    </Link>
                  </li>
                  {/* Menu Item Data Kategori */}
                  <li>
                    <Link
                      href="/admin/data_kategori"
                      className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-orange-100 hover:rounded-lg ${
                        (pathname === "/admin/data_kategori" ||
                          pathname.includes("admin/data_kategori")) &&
                        "bg-orange-100 text-orange-500"
                      }`}
                    >
                      <HiOutlineQueueList size={20} />
                      Data Kategori
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
