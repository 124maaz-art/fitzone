import { getAdminBookings } from "@/lib/admin-data";
import { BookingsManager } from "@/components/admin/bookings-manager";

export const metadata = { title: "Admin | Bookings" };

export default async function AdminBookingsPage() {
  const listings = await getAdminBookings();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Bookings</h1>
      <BookingsManager bookings={listings} />
    </div>
  );
}
