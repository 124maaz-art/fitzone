import { InquiriesManager } from "@/components/admin/inquiries-manager";
import { getAdminInquiries } from "@/lib/admin-data";

export const metadata = { title: "Admin | Inquiries" };

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Inquiries</h1>
      <InquiriesManager inquiries={inquiries} />
    </div>
  );
}
