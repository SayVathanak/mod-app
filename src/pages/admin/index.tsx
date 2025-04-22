import AdminDashboard from "@/components/AdminDashboard";
import AdminLayout from "@/components/AdminLayout";
import Head from "next/head";

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Command Center | Admin Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </>
  );
}