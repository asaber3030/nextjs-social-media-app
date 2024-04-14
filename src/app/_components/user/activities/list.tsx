"use client";

import { Activity } from "@/types";
import { OneActivity } from "./activity";
import { EmptyState } from "../empty-list";


export const ListActivities = ({ activities }: { activities: Activity[] }) => {
  
  return (
    <div>
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">My Activity</h1>
        <span className="font-normal text-gray-500">{activities.length} {activities.length > 1 ? 'activities' : 'activity'}</span>
      </header>

      {activities.length > 0 ? (
        <section className="space-y-2">
          {activities.map((act) => (
            <OneActivity activity={act} />
          ))}
        </section>
      ): (
        <EmptyState title="No activities found." />
      )}
      
      
    </div>
  );
}
 