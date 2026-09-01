import { TrainerManager } from "@/components/admin/trainer-manager";
import { getAdminTrainers } from "@/lib/admin-data";

export const metadata = { title: "Admin | Trainers" };

export default async function AdminTrainersPage() {
  const trainers = await getAdminTrainers();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Trainers</h1>
      <TrainerManager trainers={trainers} />
    </div>
  );
}
