import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <>
      {/* Header Mobile */}
      <div className="w-full bg-white px-6 py-3 border border-b-2 fixed top-0 z-50 lg:hidden">
        <div className="flex items-center justify-center gap-2">
          <Image src="/image/logoaja.png" alt="logo" width={35} height={35} />
          <h1 className="text-sm font-bold">
            Peminjaman Aset Yayasan Ulil Albab Batam
          </h1>
        </div>
      </div>

      {/* Navbar */}
      <nav className="w-full z-50 bg-white px-6 lg:px-12 py-4 border border-b-2 fixed bottom-0 lg:bottom-auto lg:top-0">
        <div className="flex items-center justify-between container mx-auto">
          <div className="hidden lg:block">
            <Image src="/image/logoaja.png" alt="logo" width={35} height={35} />
          </div>
          <div className="w-full lg:w-auto">
            <ul className="flex gap-6 items-center justify-between">
              <li>
                <Link
                  href="/beranda"
                  className={`flex gap-1 items-center ${
                    router.pathname === "/beranda"
                      ? "text-orange-500"
                      : "text-black"
                  }`}
                >
                  <Image
                    src={
                      router.pathname === "/beranda"
                        ? "icon/beranda-active.svg"
                        : "icon/beranda.svg"
                    }
                    alt="icon beranda"
                    width={24}
                    height={24}
                  />
                  <p className="font-medium">Beranda</p>
                </Link>
              </li>
              <li>
                <Link
                  href="/riwayat"
                  className={`flex gap-1 items-center ${
                    router.pathname === "/riwayat"
                      ? "text-orange-500"
                      : "text-black"
                  }`}
                >
                  <Image
                    src={
                      router.pathname === "/riwayat"
                        ? "icon/riwayat-active.svg"
                        : "icon/riwayat.svg"
                    }
                    alt="icon riwayat"
                    width={24}
                    height={24}
                  />
                  <p className="font-medium">Riwayat</p>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex gap-1 items-center">
                  <Image
                    src="icon/akun-saya.svg"
                    alt="icon akun saya"
                    width={24}
                    height={24}
                  />
                  <p className="font-medium">Akun Saya</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
