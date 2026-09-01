import { GenericCrud } from "@/components/admin/generic-crud";
import { getAdminTransformations } from "@/lib/admin-data";
import { upsertTransformation, deleteTransformation } from "@/lib/admin-actions";

export const metadata = { title: "Admin | Transformations" };

export default async function AdminTransformationsPage() {
  const transformations = await getAdminTransformations();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Transformations</h1>
      <GenericCrud
        title="Transformations"
        items={transformations}
        fields={[
          { name: "memberName", label: "Member Name *", type: "text" },
          { name: "beforeImage", label: "Before Image *", type: "image" },
          { name: "afterImage", label: "After Image *", type: "image" },
          { name: "story", label: "Story *", type: "textarea" },
          { name: "duration", label: "Duration *", type: "text", placeholder: "e.g. 6 months" },
          { name: "goal", label: "Goal *", type: "text" },
          { name: "result", label: "Result *", type: "text" },
          { name: "active", label: "Active", type: "checkbox" },
        ]}
        saveFn={upsertTransformation}
        deleteFn={deleteTransformation}
      />
    </div>
  );
}
