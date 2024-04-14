import Image from "next/image";

export const PrivateContent = ({ label = 'Private content' }: { label?: React.ReactNode }) => {
  return (
    <div className="flex items-center flex-col justify-center my-5 shadow-lg shadow-gray-900/10 bg-lightBg py-5 rounded-md ring-2 ring-lightBg">
      <Image alt='private_image' src='/defaults/private.svg' width={100} height={100} />
      <p className="text-gray-300 max-w-[60%] mx-auto text-center">{label}</p>
    </div>
  );
}