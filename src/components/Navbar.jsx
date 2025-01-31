import React from 'react'

const Navbar = () => {
  return (
    <div>
      <nav className='bg-emerald-100 flex py-4 px-6 items-centre justify-between'>
        <h2 className='text-2xl font-bold'>Dashboard</h2>

        <div className='flex gap-10 items-right align-center'>
          <h4 className='text-xl'>About</h4>
          <h4 className='text-xl'>Contact</h4>
          <h4 className='text-xl'>Home</h4>
          <h4 className='text-xl'>Main Course</h4>
        </div>
      </nav>
    </div>
  )
}

export default Navbar