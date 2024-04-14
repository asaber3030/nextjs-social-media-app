export const ShowFeelingState = ({ feelingState }: { feelingState: string }) => {

  if (!feelingState) return null;
  
  return (
    <div className='font-normal text-sm text-gray-600'>feeling <span className='text-blue-500 capitalize' dangerouslySetInnerHTML={{ __html: feelingState }} /></div>
  )
}
 
 