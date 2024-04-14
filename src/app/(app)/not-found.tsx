"use client"

import { Button } from "@/components/ui/button";
import { useUsername } from "@/hooks";
import { picture } from "@/lib";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Error404 = () => {

  return (
    <div className='text-center'>
      <Image src={picture('error404')} alt='Error 404' width={200} height={200} className='mx-auto' />
      <div className='bg-black/50 rounded-md p-4 mt-4 flex flex-col gap-y-2'>
        <h1>Requested URL was not found!</h1>
        <Link href='/'><Button variant='secondary' size='sm'><Home className='size-5' /> Home</Button></Link>
      </div>
    </div>
  );
}
 
export default Error404;