import { Button } from "@/components/ui/button";
import { Activity, Check, Smile } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ActivityType, PostDoingActivity } from "@/lib/post-activity";
import { cn } from "@/lib/utils";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  doingState: string,
  setDoingState: any
}

export const UserDoingSomethingList = ({ doingState, setDoingState }: Props) => {

  const [activityInput, setActivityInput] = useState<string>('')
  const [selectedActivity, setSelectedActivity] = useState<null | undefined | ActivityType>(null)

  const selectAnActivity = (label: string, id: number, hasInput: boolean) => {
    setDoingState((old: string) => `${label}`)
    setSelectedActivity(old => PostDoingActivity.find((item: ActivityType) => item.id === id))
    if (!hasInput) {
      setActivityInput('')
    }
  }

  const selectInputValue = () => {
    setDoingState((old: string) => selectedActivity?.label + ' ' + activityInput)
  }

  const resetActivity = () => {
    setActivityInput((old: string) => '')
    setDoingState((old: string) => '')
    setSelectedActivity(old => null)
  }

  return (
    <div>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn(selectedActivity && 'bg-accent')} size='sm' variant='outline'><Activity className='size-4' /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[800px]">
        <DropdownMenuLabel className='text-left'>
          <div className='flex items-center justify-between'>
            I'm currently doing...
            {selectedActivity && (
              <Button size='sm' variant='outline' onClick={resetActivity}>Remove</Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className='grid grid-cols-2 gap-2'>
          {PostDoingActivity.map(({ label, id, hasInput, icon: Icon }: ActivityType) => (
            <Button
              key={`activity-idx-${id}`}
              variant='outline' 
              onClick={ () => selectAnActivity(label, id, hasInput as boolean) }
              className={cn(
                'flex items-center gap-4',
                selectedActivity?.id === id && 'bg-accent'
              )}>
              {selectedActivity?.id === id && <Check className='text-green-800' />}
              <div className='flex justify-between items-center flex-row-reverse w-full'>
                <Icon /> 
                <span>{label} ...</span>
              </div>
            </Button>
          ))}
        </div>

        {selectedActivity && selectedActivity.hasInput && (
          <div className='mt-2 flex items-center justify-center gap-2'>
            <Input
              placeholder={selectedActivity.label + '...'}
              value={activityInput}
              maxLength={25}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setActivityInput(event?.target?.value)}
            />
          </div>
        )}
        <DropdownMenuItem onClick={selectInputValue} className='flex items-center justify-center mt-2 bg-blue-800 focus:bg-blue-900'>Submit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}
 