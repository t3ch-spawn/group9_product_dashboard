import React from 'react'

export default function Navbar() {
  return (
    <nav className='w-full flex justify-center items-center py-[15px] shadow-sm sticky top-0 bg-white z-[100]'>

        <ul className='flex justify-center items-center gap-[40px]'>
            <a href='/'>Dashboard</a>
            <a href='/inventory'>Inventory</a>
        </ul>

    </nav>
  )
}
