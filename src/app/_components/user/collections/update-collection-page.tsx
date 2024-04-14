"use client";

import { AddItemForm } from "./add-item";
import { UpdateCollectionForm } from "./update-form";
import { Collection } from "@/types";
import { UpdateCollectionItems } from "./update-items";
import { DeleteCollection } from "./delete-collection";
import { notFound } from "next/navigation";

export const UpdateCollectionPage = ({ collection }: { collection: Collection }) => {

  if (!collection) return notFound()

  return (
    <div className='space-y-4 pb-8'>
      <UpdateCollectionForm collection={collection} />
      <AddItemForm collection={collection} />
      <UpdateCollectionItems collection={collection} />
      <DeleteCollection collection={collection} />
    </div>
  );
}
