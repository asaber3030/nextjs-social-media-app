import { LoadingButton } from "@/components/loading-button"
import { SendHorizonal } from "lucide-react"

export const PublishButton = ({ status }: { status: string }) => {
  return (
    <LoadingButton
      loading={status === 'pending'} 
      className='w-fit' 
      size='sm'
      >
        {status === 'pending' ? 'Publishing ...' : <><SendHorizonal className='size-5' /> Publish</>}
    </LoadingButton>
  )
}