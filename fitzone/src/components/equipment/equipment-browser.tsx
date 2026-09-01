"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Dumbbell } from "lucide-react";
import { Input, Select } from "@/components/ui/form";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { EmptyState } from "@/components/ui/empty-state";

type Equipment = {
  id: string;
  slug: string;
  name: string;
  image?: string | null;
  description: string;
  targetMuscle?: string | null;
  trainingType?: string | null;
  category: { name: string; slug: string };
};

type Category = { id: string; name: string; slug: string };

export function EquipmentBrowser({
  equipment,
  categories,
}: {
  equipment: Equipment[];
  categories: Category[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [trainingType, setTrainingType] = useState(params.get("type") ?? "all");
  const [targetMuscle, setTargetMuscle] = useState(params.get("muscle") ?? "all");
  const [sort, setSort] = useState(params.get("sort") ?? "name");

  function updateParam(key: string, value: string) {
    const url = new URL(window.location.href);
    if (value === "all" || value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    router.replace(url.pathname + url.search, { scroll: false });
  }

  function handleFilter(key: string, value: string, setter: (v: string) => void) {
    setter(value);
    updateParam(key, value);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
  }

  useEffect(() => {
    const id = setTimeout(() => {
      updateParam("q", search);
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const trainingTypes = useMemo(
    () => Array.from(new Set(equipment.map((e) => e.trainingType).filter(Boolean))) as string[],
    [equipment]
  );
  const targetMuscles = useMemo(
    () => Array.from(new Set(equipment.map((e) => e.targetMuscle).filter(Boolean))) as string[],
    [equipment]
  );

  const filtered = useMemo(() => {
    let list = equipment.filter((e) => {
      const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === "all" || e.category.slug === category;
      const matchesType = trainingType === "all" || e.trainingType === trainingType;
      const matchesMuscle = targetMuscle === "all" || e.targetMuscle === targetMuscle;
      return matchesSearch && matchesCat && matchesType && matchesMuscle;
    });
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "category") return a.category.name.localeCompare(b.category.name);
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [equipment, search, category, trainingType, targetMuscle, sort]);

  return (
    <div>
      <div className="mb-8 grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search equipment..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search equipment"
          />
        </div>
        <Select value={category} onChange={(e) => handleFilter("category", e.target.value, setCategory)} aria-label="Filter by category">
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </Select>
        <Select value={trainingType} onChange={(e) => handleFilter("type", e.target.value, setTrainingType)} aria-label="Filter by training type">
          <option value="all">All Training Types</option>
          {trainingTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => handleFilter("sort", e.target.value, setSort)} aria-label="Sort">
          <option value="name">Sort: Name</option>
          <option value="category">Sort: Category</option>
        </Select>
      </div>

      {targetMuscles.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleFilter("muscle", "all", setTargetMuscle)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${targetMuscle === "all" ? "bg-accent text-white" : "bg-white/5 text-muted hover:text-foreground"}`}
          >
            All Muscles
          </button>
          {targetMuscles.map((m) => (
            <button
              key={m}
              onClick={() => handleFilter("muscle", m, setTargetMuscle)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${targetMuscle === m ? "bg-accent text-white" : "bg-white/5 text-muted hover:text-foreground"}`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="h-6 w-6" />}
          title="No equipment found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((e) => (
            <EquipmentCard key={e.id} equipment={e} />
          ))}
        </div>
      )}
    </div>
  );
}
