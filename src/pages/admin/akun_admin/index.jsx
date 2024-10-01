import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RiLockPasswordLine } from "react-icons/ri";
import { LuUser2 } from "react-icons/lu";
import Modal from "@/components/modal";
import Swal from "sweetalert2";
import ModalLoading from "@/components/modalLoading";

export default function AdminKonfirmasi() {
  const [loadingModal, setLoadingModal] = useState(false);
  const [tokenCookie, setTokenCookie] = useState(null);

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
      } else {
        setTokenCookie(data);
      }
    };

    checkAuth();
  }, [router]);

  // fetch data profil
  const [users, setUsers] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tokenCookie) {
      fetchData();
    }
  }, [tokenCookie]);
  const fetchData = () => {
    fetch("/api/akunAdmin")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.find((user) => user.id === tokenCookie.id);
        setUsers(filteredData);
      })
      .catch((err) => {
        setError(err);
      });
  };

  // Ubah Profil
  const [ubahProfilAdmin, setUbahProfilAdmin] = useState(false);
  const [usernameAdmin, setUsernameAdmin] = useState(false);
  const [waAdmin, setWaAdmin] = useState(false);

  const handleUbahProfilAdmin = () => {
    setUbahProfilAdmin(true);
    setUsernameAdmin(users.username);
    setWaAdmin(users.no_wa);
  };
  const handleCloseUbahProfilAdmin = () => {
    setUbahProfilAdmin(null);
  };
  const handleSubmitUbahProfilAdmin = (event) => {
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
          const res = await fetch("/api/akunAdmin", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              updatedId: users.id,
              updatedUsername: usernameAdmin,
              updatedWa: waAdmin,
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
            window.location.reload();
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
          setUbahProfilAdmin(false);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error,
            icon: "error",
            showConfirmButton: false,
            timer: 10000,
          });
          setLoadingModal(false);
          setUbahProfilAdmin(false);
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
            const res = await fetch("/api/passwordAdmin", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
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

  return (
    <>
      <Head>
        <title>Profil Admin</title>
      </Head>
      <DefaultLayout>
        <div className="flex flex-col">
          {/* Data Diri Title */}
          <h1 className="text-xl font-semibold">Profil Admin</h1>

          {/* Table */}
          <div className="mt-5 w-full md:mt-10 lg:w-1/2 flex flex-col items-center">
            <table className="table">
              <tbody>
                <tr>
                  <th>Username</th>
                  <td>{users.username}</td>
                </tr>
                <tr>
                  <th>Unit</th>
                  <td>{users.unit}</td>
                </tr>
                <tr>
                  <th>Nomor Whatsapp</th>
                  <td>{users.no_wa == null ? "-" : users.no_wa}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Button ganti password dan logout */}
          <div className="flex gap-5 mt-5 md:mt-10">
            <button
              className="btn btn-outline border-orange-500 text-orange-500 hover:border-orange-500 hover:bg-orange-500"
              onClick={handleUbahProfilAdmin}
            >
              <LuUser2 size={20} />
              Ubah Profil
            </button>
            <button
              className="btn btn-outline border-orange-500 text-orange-500 hover:border-orange-500 hover:bg-orange-500"
              onClick={handleUbahPassword}
            >
              <RiLockPasswordLine size={20} />
              Ganti Password
            </button>
          </div>
        </div>
      </DefaultLayout>

      {/* Modal Ubah Data Diri */}
      {ubahProfilAdmin && (
        <Modal title="Ubah Data Diri" onCloseModal={handleCloseUbahProfilAdmin}>
          <form
            className="mt-4"
            action=""
            onSubmit={handleSubmitUbahProfilAdmin}
          >
            {/* Username */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan username"
                className="input input-bordered w-full"
                value={usernameAdmin}
                onChange={(e) => setUsernameAdmin(e.target.value)}
                required
              />
            </label>
            {/* Nomor WA */}
            {users.role === "admin" && (
              <label className="form-control w-full mt-2">
                <div className="label">
                  <span className="label-text">Nomor WA</span>
                </div>
                <input
                  type="number"
                  placeholder="Masukkan nomor wa"
                  className="input input-bordered w-full"
                  value={waAdmin}
                  onChange={(e) => setWaAdmin(e.target.value)}
                  required
                />
              </label>
            )}
            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button className="btn" onClick={handleCloseUbahProfilAdmin}>
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
