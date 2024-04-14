import { getActivity } from "@/actions/user";

import { ListActivities } from "@/app/_components/user/activities/list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Activity",
  description: "User activity!"
}

const ActivitiesPage = async () => {
  const { data } = await getActivity();
  return (
    <ListActivities activities={data} />
  );
}
 
export default ActivitiesPage;