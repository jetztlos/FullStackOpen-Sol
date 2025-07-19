// part7/routed-anecdotes/src/hooks/useField.js

import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('') // Reset the value to an empty string
  }

  return {
    type,
    value,
    onChange,
    reset // Return the reset function
  }
}
