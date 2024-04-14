import { getCollection } from "@/actions/user";
import { UpdateCollectionPage } from "@/app/_components/user/collections/update-collection-page";

const CollectionViewPage = async ({ params }: { params: { id: string } }) => {

  const { data: collection } = await getCollection(parseInt(params.id))

  return (
    <div>
      <UpdateCollectionPage collection={collection} />
    </div>
  );
}
 
export default CollectionViewPage;