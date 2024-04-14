import { userLoggedData } from "@/actions/user";
import { SearchUsers } from "@/app/_components/search/search";
import { User } from "@/types";

interface Props {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined }
}

const SearchPage = async ({ params, searchParams }: Props) => {

  const current = await userLoggedData() as User

  return (
    <div>
      <SearchUsers current={current} />
    </div>
  );
}
 
export default SearchPage;