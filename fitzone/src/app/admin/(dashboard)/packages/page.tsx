import { GenericCrud } from "@/components/admin/generic-crud";
import { getAdminPackages } from "@/lib/admin-data";
import { upsertPackage, deletePackage } from "@/lib/admin-actions";

export const metadata = { title: "Admin | Packages" };

export default async function AdminPackagesPage() {
  const packages = await getAdminPackages();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Membership Packages</h1>
      <GenericCrud
        title="Packages"
        items={packages}
        fields={[
          { name: "name", label: "Name *", type: "text" },
          { name: "price", label: "Price ($)", type: "number" },
          { name: "duration", label: "Duration *", type: "text", placeholder: "e.g. Monthly / 3 months" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "benefits", label: "Benefits", type: "array", placeholder: "One benefit per line" },
          { name: "featured", label: "Featured / Recommended", type: "checkbox" },
          { name: "active", label: "Active", type: "checkbox" },
        ]}
        saveFn={upsertPackage}
        deleteFn={deletePackage}
      />
    </div>
  );
}
