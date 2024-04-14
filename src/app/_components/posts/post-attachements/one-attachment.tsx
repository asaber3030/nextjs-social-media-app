import Image from "next/image";

import { PostAttachment } from "@/types";

interface Props {
  file: PostAttachment
  width?: number,
  height?: number,
}

export const Attachment = ({ file, width = 200, height = 200 }: Props) => {
  return (
    <Image
      alt='Post Attachment'
      className='object-contain h-full rounded-md'
      src={file.path}
      width={width}
      height={height}
    />
  );
}