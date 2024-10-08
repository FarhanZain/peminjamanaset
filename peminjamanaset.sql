-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 08 Okt 2024 pada 22.23
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `template`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_aset`
--

CREATE TABLE `tbl_aset` (
  `id` int(11) NOT NULL,
  `no_aset` varchar(50) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `id_unit` int(50) NOT NULL,
  `lokasi` varchar(50) NOT NULL,
  `gambar` varchar(50) DEFAULT NULL,
  `id_kategori` int(50) NOT NULL,
  `status_aset` varchar(50) NOT NULL,
  `detail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_kategori`
--

CREATE TABLE `tbl_kategori` (
  `id` int(50) NOT NULL,
  `kategori` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tbl_kategori`
--

INSERT INTO `tbl_kategori` (`id`, `kategori`) VALUES
(1, 'Vehicle / Kendaraan'),
(2, 'Komputer / Printer + Aksesoris'),
(3, 'Elektronik'),
(4, 'Elektrik / Machinery'),
(5, 'Non Elektrik'),
(6, 'Furniture');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_riwayat`
--

CREATE TABLE `tbl_riwayat` (
  `id` int(11) NOT NULL,
  `id_aset` int(50) NOT NULL,
  `id_user` int(50) NOT NULL,
  `tgl_mulai` datetime NOT NULL,
  `tgl_selesai` datetime NOT NULL,
  `tgl_pengajuan` datetime NOT NULL,
  `tgl_pengembalian` datetime DEFAULT NULL,
  `keperluan` varchar(255) NOT NULL,
  `catatan` varchar(255) DEFAULT NULL,
  `status_pinjam` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_unit`
--

CREATE TABLE `tbl_unit` (
  `id` int(50) NOT NULL,
  `unit` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tbl_unit`
--

INSERT INTO `tbl_unit` (`id`, `unit`) VALUES
(1, 'Yayasan'),
(2, 'TKIT'),
(3, 'TPA'),
(4, 'SDIT'),
(5, 'SMPIT'),
(6, 'SMAIT');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `no_wa` bigint(15) DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  `id_unit` int(50) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `nama_lengkap` varchar(255) DEFAULT NULL,
  `alamat` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `username`, `password`, `no_wa`, `role`, `id_unit`, `status`, `nama_lengkap`, `alamat`) VALUES
(1, 'superadmin', '$2a$10$vbiyglOiClHcJef6ehjEquKa5n1ITtstRiCJbqVbC9BF8n/Ecvloa', NULL, 'superadmin', NULL, 'Aktif', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tbl_aset`
--
ALTER TABLE `tbl_aset`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_unit` (`id_unit`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- Indeks untuk tabel `tbl_kategori`
--
ALTER TABLE `tbl_kategori`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tbl_riwayat`
--
ALTER TABLE `tbl_riwayat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_aset` (`id_aset`) USING BTREE;

--
-- Indeks untuk tabel `tbl_unit`
--
ALTER TABLE `tbl_unit`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_unit` (`id_unit`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `tbl_aset`
--
ALTER TABLE `tbl_aset`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tbl_kategori`
--
ALTER TABLE `tbl_kategori`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `tbl_riwayat`
--
ALTER TABLE `tbl_riwayat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tbl_unit`
--
ALTER TABLE `tbl_unit`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `tbl_aset`
--
ALTER TABLE `tbl_aset`
  ADD CONSTRAINT `tbl_aset_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `tbl_unit` (`id`),
  ADD CONSTRAINT `tbl_aset_ibfk_3` FOREIGN KEY (`id_kategori`) REFERENCES `tbl_kategori` (`id`);

--
-- Ketidakleluasaan untuk tabel `tbl_riwayat`
--
ALTER TABLE `tbl_riwayat`
  ADD CONSTRAINT `tbl_riwayat_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `tbl_user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_riwayat_ibfk_2` FOREIGN KEY (`id_aset`) REFERENCES `tbl_aset` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD CONSTRAINT `tbl_user_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `tbl_unit` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
