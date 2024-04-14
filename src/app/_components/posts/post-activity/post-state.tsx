import { ShowFeelingState } from "./feeling-state-show"
import { ShowDoingState } from "./doing-state-show"

export const PostFeelingAndDoingStates = ({ doingState, feelingState }: { doingState: string, feelingState: string }) => {
  return (
    <>
      <ShowDoingState doingState={doingState} />
      {doingState && feelingState && <span className='text-gray-400 text-sm'>and</span>}
      <ShowFeelingState feelingState={feelingState} />
    </>
  )
}