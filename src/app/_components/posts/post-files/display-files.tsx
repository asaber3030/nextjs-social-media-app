import Image from "next/image";

export const DisplayPostFiles = ({ pictures, slice = false }: { slice?: boolean, pictures: any }) => {
  
  if (!pictures && !pictures?.length) return null;

  let finalPictures;
  
  if (slice) {
    finalPictures = pictures.length > 3 ? pictures.slice(0, slice) : pictures
  }
  finalPictures = pictures

  return (
    <section className='flex gap-2 justify-start flex-wrap'>
      {finalPictures?.map((item: any, idx: number) => (
        <Image 
          src={item} 
          key={`pic-display-post-${idx}`} 
          alt='Picture display' 
          width={200} 
          height={200}
          className='rounded-md overflow-hidden object-fill max-w-[100%] max-h-[100%]'
        />
      ))}
    </section>
  );
}
 