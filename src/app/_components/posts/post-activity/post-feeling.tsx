import { Button } from "@/components/ui/button";
import { Activity, Check, Smile } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import {PostFeeling, FeelingType } from "@/lib/post-activity";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  feelingState: string,
  setFeelingState: any
}

export const UserFeelingSomethingList = ({ feelingState, setFeelingState }: Props) => {

  const [selectedFeeling, setSelectedFeeling] = useState<null | undefined | FeelingType>(null)

  const selectFeeling = (label: string, face: string, id: number) => {
    setFeelingState((old: string) => `${face} ${label}`)
    setSelectedFeeling(old => PostFeeling.find((item: FeelingType) => item.id === id))
  }

  const resetFeeling = () => {
    setFeelingState((old: string) => '')
    setSelectedFeeling(old => null)
  }

  return (
    <div>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn(selectedFeeling && 'bg-accent')} size='sm' variant='outline'><Smile className='size-4' /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[800px]">
        <DropdownMenuLabel className='text-left'>
          <div className='flex items-center justify-between'>
            I'm currently feeling...
            {selectedFeeling && (
              <Button size='sm' variant='outline' onClick={resetFeeling}>Remove</Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className='grid grid-cols-4 gap-2'>
          {PostFeeling.map(({ label, id, face }: FeelingType) => (
            <Button
              key={`feeling-idx-${id}`}
              variant='outline' 
              onClick={ () => selectFeeling(label, face, id) }
              className={cn(
                'flex items-center gap-4',
                selectedFeeling?.id === id && 'bg-accent'
              )}>
              {selectedFeeling?.id === id && <Check className='text-green-800' />}
              <div className='flex justify-between items-center flex-row-reverse w-full'>
                <span dangerouslySetInnerHTML={{ __html: face }} />
                <span>{label}</span>
              </div>
            </Button>
          ))}
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}
 