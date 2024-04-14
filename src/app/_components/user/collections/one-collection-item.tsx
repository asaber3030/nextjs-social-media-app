import Image from "next/image";

import { CollectionItem } from "@/types";

export const OneCollectionItem = ({ item }: { item: CollectionItem }) => {
  return (
    <Image 
      alt='Item' 
      src={item.file}
      width={0} 
      height={0} 
      sizes="100vw" 
      layout="fill" 
      className="h-auto w-full object-contain rounded-md" 
    />
  );
}