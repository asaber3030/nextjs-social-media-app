import { Facebook, Instagram, Twitch, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className='bg-lightBg'>
      <div className='
        p-8 
        xl:w-[1000px] lg:mx-auto lg:flex justify-between
      '>
        <div>
          <Image alt='Logo' width={50} height={50} src='/logo.png' className='my-4 mx-auto lg:mx-0' />
          <h4 className='font-bold text-center lg:text-left'>Social</h4>
          <div className='flex gap-4 justify-center flex-wrap my-5'>
            <Link href='/' className='hover:text-blue-400 w-fit'><Facebook /></Link>
            <Link href='/' className='hover:text-blue-400 w-fit'><Twitter /></Link>
            <Link href='/' className='hover:text-blue-400 w-fit'><Instagram /></Link>
            <Link href='/' className='hover:text-blue-400 w-fit'><Twitch /></Link>
          </div>
        </div>
        <ul className='grid grid-cols-2 gap-2 h-fit'>
          <Link href='/' className='hover:underline h-fit'>Perferences</Link>
          <Link href='/' className='hover:underline h-fit'>Terms & License</Link>
          <Link href='/' className='hover:underline h-fit'>About</Link>
          <Link href='/' className='hover:underline h-fit'>Help</Link>
          <Link href='/' className='hover:underline h-fit'>Support</Link>
          <Link href='/' className='hover:underline h-fit'>FAQ</Link>
          <Link href='/' className='hover:underline h-fit'>API</Link>
          <Link href='/' className='hover:underline h-fit'>Contact</Link>
        </ul>
      </div>
    </footer>
  )
}