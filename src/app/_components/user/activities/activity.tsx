"use client";

import { Activity } from "@/types"
import moment from "moment";
import { useRouter } from "next/navigation";

export const OneActivity = ({ activity }: { activity: Activity }) => {

  const router = useRouter()

  return (
    <div className="cursor-pointer px-4 py-2 bg-lightBg rounded-md shadow-lg" onClick={ () => router.push(activity.url) }>
      <h2 className='font-semibold'>{activity.title}</h2>
      <p className='text-gray-500'>{moment(activity.createdAt).fromNow()}</p>
    </div>
  )
}