import db from '../../lib/db';

export default async function handler(req, res) {
    const today = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).replace(' ', 'T').slice(0, 16)
    try {
        const [rows] = await db.query('SELECT r.id, r.tgl_selesai, r.status_pinjam, u.nama_lengkap, u.no_wa, a.no_aset, a.nama FROM tbl_riwayat r JOIN tbl_user u ON r.id_user = u.id JOIN tbl_aset a ON r.id_aset = a.id WHERE status_pinjam IN (?, ?) AND tgl_selesai < ?', ['Disetujui', 'Jatuh Tempo', today]);
        rows.forEach( async (row) => {
            try {
                const data = new FormData();
                data.append("target", `0${row.no_wa}`);
                data.append(
                "message",
                `Halo ${row.nama_lengkap}, aset ${row.no_aset} - ${row.nama} telah *_Jatuh Tempo_*, segera kembalikan aset kembali ke tempatnya dan tekan tombol *_Kembalikan_* di aplikasi peminjaman aset. Terima kasih.`
                );
                data.append("delay", "0");
                data.append("countryCode", "62");

                const resWa = await fetch("https://api.fonnte.com/send", {
                    method: "POST",
                    mode: "cors",
                    headers: new Headers({
                        Authorization: "pVHcLp66otGgrACBuCWm",
                    }),
                    body: data,
                });

                const waResult = await resWa.json();
                if (waResult.status) {
                    console.log(`Pesan berhasil dikirim`);
                } else {
                    console.log(`Gagal mengirim pesan`);
                }

                await db.query('UPDATE tbl_riwayat SET status_pinjam = ? WHERE id = ?', ['Jatuh Tempo', row.id]);
            } catch (error) {
                res.status(403).json({ error: 'Gagal update data' });
            }
        });
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Gagal fetching data' });
    }
}