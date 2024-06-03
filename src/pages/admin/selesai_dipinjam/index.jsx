import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import DataTable from "react-data-table-component";

export default function AdminSelesaiDipinjam() {
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "rgb(255 237 213)",
        fontSize: "16px",
        fontWeight: "600",
      },
    },
    cells: {
      style: {
        fontSize: "16px",
      },
    },
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Year",
      selector: (row) => row.year,
      sortable: true,
    },
  ];

  const data = [
    {
      id: 1,
      title: "Selesai dipinjam 1",
      year: "2020",
    },
    {
      id: 2,
      title: "Selesai dipinjam 2",
      year: "2021",
    },
    {
      id: 3,
      title: "Selesai dipinjam 3",
      year: "2022",
    },
  ];
  return (
    <>
      <Head>
        <title>Aset Selesai Dipinjam</title>
      </Head>
      <DefaultLayout>
        <h1 className="text-xl font-semibold">Aset Selesai Dipinjam</h1>
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            pagination
          />
        </div>
      </DefaultLayout>
    </>
  );
}
