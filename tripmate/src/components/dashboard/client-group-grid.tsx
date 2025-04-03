"use client";

import { useState } from "react";
import { GroupCard } from "../group-card";
import { AddGroupCard } from "../add-group-card";

export function ClientGroupGrid({ groups }: { groups: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleGroups = showAll ? groups : groups.slice(0, 7);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
        <AddGroupCard />
      </div>
      {!showAll && groups.length > 7 && (
        <div className="mt-6 flex justify-center">
          <button
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
            onClick={() => setShowAll(true)}
          >
            Show more
          </button>
        </div>
      )}
    </>
  );
}
