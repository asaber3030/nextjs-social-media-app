import { AttachmentModal } from "./attachment-modal";
import { Post, PostAttachment } from "@/types";

export const PostAttachments = ({ post, attachments }: { post: Post, attachments: PostAttachment[] }) => {
  return (
    <div className='flex flex-wrap gap-2 my-2'>
      {attachments.map((file) => (
        <AttachmentModal key={`attachment-modal-idx-${file.id}`} attachments={attachments} post={post} file={file} />
      ))}
    </div>
  );
}