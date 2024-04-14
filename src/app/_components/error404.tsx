import Image from "next/image";
import Link from "next/link";

import { picture } from "@/lib";
import { Button } from "@/components/ui/button";

export const NotFound = () => {
  return (
    <div className='text-center bg-lightBg shadow-lg'>
      <Image src={picture('error404')} alt='Error 404' width={250} height={250} className='mx-auto' />
      <div className='rounded-md p-4 pt-0 flex flex-col gap-y-2'>
        <h1 className='font-bold text-gray-300'>Requested URL was not found!</h1>
        <Link href='/'><Button variant='secondary' size='sm'>/Home</Button></Link>
      </div>
    </div>
  );
}
 