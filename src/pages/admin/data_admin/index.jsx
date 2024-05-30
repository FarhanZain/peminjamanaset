import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Head from "next/head";
import $ from "jquery";
import "datatables.net-responsive-dt";
import { useEffect } from "react";

export default function AdminDataAdmin() {
  useEffect(() => {
    if (!$.fn.DataTable.isDataTable("#tableDataAdmin")) {
      $("#tableDataAdmin").DataTable({
        responsive: true,
        pageLength: 10,
      });
    }
  }, []);

  const looping = Array.from({ length: 20 });
  return (
    <>
      <Head>
        <title>Data Admin</title>
      </Head>
      <DefaultLayout>
        <div>
          <table
            id="tableDataAdmin"
            className="display responsive nowrap table-lg"
          >
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
                <th>Column 4</th>
                <th>Column 4</th>
                <th>Column 4</th>
              </tr>
            </thead>
            <tbody>
              {looping.map((_, index) => (
                <tr key={index}>
                  <td>Row 1 Data 1</td>
                  <td>Row 1 Data 2</td>
                  <td>Row 1 Data 3</td>
                  <td>Row 1 Data 4</td>
                  <td>Row 1 Data 4</td>
                  <td>Row 1 Data 4</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DefaultLayout>
    </>
  );
}
