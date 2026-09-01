import { GenericCrud } from "@/components/admin/generic-crud";
import { getAdminPrograms } from "@/lib/admin-data";
import { upsertProgram, deleteProgram } from "@/lib/admin-actions";

export const metadata = { title: "Admin | Programs" };

export default async function AdminProgramsPage() {
  const programs = await getAdminPrograms();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Programs</h1>
      <GenericCrud
        title="Programs"
        items={programs}
        fields={[
          { name: "name", label: "Name *", type: "text" },
          { name: "image", label: "Image *", type: "image" },
          { name: "description", label: "Description *", type: "textarea" },
          { name: "duration", label: "Duration *", type: "text", placeholder: "e.g. 8 weeks" },
          { name: "difficulty", label: "Difficulty", type: "select", options: [{ value: "Beginner", label: "Beginner" }, { value: "Intermediate", label: "Intermediate" }, { value: "Advanced", label: "Advanced" }, { value: "All Levels", label: "All Levels" }] },
          { name: "benefits", label: "Benefits", type: "array", placeholder: "One benefit per line" },
          { name: "active", label: "Active", type: "checkbox" },
        ]}
        saveFn={upsertProgram}
        deleteFn={deleteProgram}
      />
    </div>
  );
}
