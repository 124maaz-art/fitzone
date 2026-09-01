import { GenericCrud } from "@/components/admin/generic-crud";
import { getAdminGallery } from "@/lib/admin-data";
import { upsertGallery, deleteGallery } from "@/lib/admin-actions";

export const metadata = { title: "Admin | Gallery" };

export default async function AdminGalleryPage() {
  const { categories, items } = await getAdminGallery();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Gallery</h1>
      <GenericCrud
        title="Gallery Items"
        items={items}
        fields={[
          { name: "title", label: "Title *", type: "text" },
          { name: "image", label: "Image *", type: "image" },
          {
            name: "categoryId",
            label: "Category",
            type: "select",
            options: categories.map((c) => ({ value: c.id, label: c.name })),
          },
          { name: "active", label: "Active", type: "checkbox" },
        ]}
        saveFn={upsertGallery}
        deleteFn={deleteGallery}
      />
    </div>
  );
}
