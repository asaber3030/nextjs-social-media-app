"use client";

import { useOptimistic } from "react";

const TestAnything = () => {


  const likes = 1

  const [ops, setOps] = useOptimistic(likes, (state, payload: 'inc' | 'dec') => {
    if (payload == 'inc') {
      return state + 1;
    } else {
      return state - 1;
    }
  })

  const updateLikes = () => {
    setOps('inc')
  }

  return (
    <div>
      
    </div>
  )
}

export default TestAnything
