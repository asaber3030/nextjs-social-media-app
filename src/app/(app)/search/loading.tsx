import { UserLongSkeleton } from "@/app/_components/skeleton/user-skeleton";

const LoadingSearch = () => {
  return (
    <UserLongSkeleton repeat={5} />
  );
}
 
export default LoadingSearch;