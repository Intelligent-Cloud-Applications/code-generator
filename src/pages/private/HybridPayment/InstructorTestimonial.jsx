import React from 'react'
import Context from '../../../Context/Context'
import { useContext } from 'react'

const InstructorTestimonial = () => {
    const {userData: UserCtx} = useContext(Context)
    console.log(UserCtx)
  return (
    <div>InstructorTestimonial</div>
  )
}

export default InstructorTestimonial