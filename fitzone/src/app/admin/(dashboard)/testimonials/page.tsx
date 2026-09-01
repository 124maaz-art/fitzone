import { GenericCrud } from "@/components/admin/generic-crud";
import { getAdminTestimonials } from "@/lib/admin-data";
import { upsertTestimonial, deleteTestimonial } from "@/lib/admin-actions";

export const metadata = { title: "Admin | Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Testimonials</h1>
      <GenericCrud
        title="Testimonials"
        items={testimonials}
        fields={[
          { name: "name", label: "Name *", type: "text" },
          { name: "image", label: "Image", type: "image" },
          { name: "rating", label: "Rating", type: "stars" },
          { name: "review", label: "Review *", type: "textarea" },
          { name: "active", label: "Active", type: "checkbox" },
        ]}
        saveFn={upsertTestimonial}
        deleteFn={deleteTestimonial}
      />
    </div>
  );
}
