import { Bed, Book, Brain, Code, LucideIcon, Gamepad, PartyPopper, Pizza, Plane, Play } from "lucide-react"

export type ActivityType = {
  id: number,
  label: string,
  icon: LucideIcon,
  hasInput?: boolean,
}

export type FeelingType = {
  id: number,
  label: string,
  face: string
}

export const PostDoingActivity: ActivityType[] = [
  {
    id: 1,
    label: 'Currently Coding!',
    icon: Code
  },
  {
    id: 2,
    label: 'Traveling to',
    icon: Plane,
    hasInput: true,
  },
  {
    id: 3,
    label: 'Eating breakfast!',
    icon: Pizza
  },
  {
    id: 4,
    label: 'Going to sleep!',
    icon: Bed
  },
  {
    id: 5,
    label: 'Celebrating about ',
    icon: PartyPopper,
    hasInput: true,
  },
  {
    id: 6,
    label: 'Watching ',
    icon: Play,
    hasInput: true,
  },
  {
    id: 7,
    label: 'Playing ',
    icon: Gamepad,
    hasInput: true,
  },
  {
    id: 8,
    label: 'Reading',
    icon: Book,
  },
]

export const PostFeeling: FeelingType[] = [
  {
    id: 1,
    label: 'Upset',
    face: '&#128517;'
  },
  {
    id: 2,
    label: 'Sad',
    face: '&#128546;',
  },
  {
    id: 3,
    label: 'Awful',
    face: '&#128534;'
  },
  {
    id: 4,
    label: 'Ill',
    face: '&#128554;'
  },
  {
    id: 5,
    label: 'Happy',
    face: '&#128513;',
  },
  {
    id: 6,
    label: 'Angry ',
    face: '&#128545;',
  },
  {
    id: 7,
    label: 'Surprised',
    face: '&#128561;',
  },
  {
    id: 8,
    label: 'Dizzy',
    face: '&#128565;',
  },
]