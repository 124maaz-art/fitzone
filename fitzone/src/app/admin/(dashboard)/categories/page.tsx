import { GenericCrud } from "@/components/admin/generic-crud";
import { getAdminCategories } from "@/lib/admin-data";
import { upsertCategory, deleteCategory } from "@/lib/admin-actions";

export const metadata = { title: "Admin | Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Equipment Categories</h1>
      <GenericCrud
        title="Categories"
        items={categories}
        fields={[
          { name: "name", label: "Name *", type: "text" },
          { name: "description", label: "Description", type: "textarea", placeholder: "Short description" },
          { name: "active", label: "Active", type: "checkbox" },
        ]}
        saveFn={upsertCategory}
        deleteFn={deleteCategory}
      />
    </div>
  );
}
