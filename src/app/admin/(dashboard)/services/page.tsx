import { GenericCrud } from "@/components/admin/generic-crud";
import { getAdminServices } from "@/lib/admin-data";
import { upsertService, deleteService } from "@/lib/admin-actions";

export const metadata = { title: "Admin | Services" };

export default async function AdminServicesPage() {
  const services = await getAdminServices();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Services</h1>
      <GenericCrud
        title="Services"
        items={services}
        fields={[
          { name: "name", label: "Name *", type: "text" },
          { name: "image", label: "Image *", type: "image" },
          { name: "description", label: "Description *", type: "textarea" },
          { name: "price", label: "Price ($)", type: "number" },
          { name: "duration", label: "Duration", type: "number" },
          { name: "durationUnit", label: "Duration Unit", type: "select", options: [{ value: "minutes", label: "Minutes" }, { value: "hours", label: "Hours" }, { value: "sessions", label: "Sessions" }] },
          { name: "benefits", label: "Benefits", type: "array", placeholder: "One benefit per line" },
          { name: "active", label: "Active", type: "checkbox" },
        ]}
        saveFn={upsertService}
        deleteFn={deleteService}
      />
    </div>
  );
}
