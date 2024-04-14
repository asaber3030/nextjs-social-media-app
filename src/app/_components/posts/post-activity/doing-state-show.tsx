export const ShowDoingState = ({ doingState }: { doingState: string }) => {

  if (!doingState) return null;
  
  return (
    <div className='font-normal text-sm text-gray-600 flex gap-1'>
      is
      <span className='text-blue-500 capitalize'> {doingState}</span>
    </div>
  )
}