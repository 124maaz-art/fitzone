import { EquipmentManager } from "@/components/admin/equipment-manager";
import { getAdminEquipment, getAdminCategories } from "@/lib/admin-data";

export const metadata = { title: "Admin | Equipment" };

export default async function AdminEquipmentPage() {
  const [items, categories] = await Promise.all([getAdminEquipment(), getAdminCategories()]);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Equipment</h1>
      <EquipmentManager items={items} categories={categories} />
    </div>
  );
}
