import { getPost } from "@/actions/post";

import { ViewPost } from "@/app/_components/posts/view-post";
import { Suspense } from "react";
import { Post } from "@/types";
import { NotFound } from "@/app/_components/error404";
import { PostSkeleton } from "@/app/_components/skeleton/post-loading-skeleton";

const ViewPostPage = async ({ params }: { params: { id: string } }) => {

  const id = parseInt(params.id)
  const data = await getPost(id)
  const post: Post = data.data

  if (post?.archived ) return <NotFound />

  return (
    <div>
      <Suspense fallback={<PostSkeleton />}>
        <ViewPost post={post} />
      </Suspense>
    </div>
  );
}
 
export default ViewPostPage;