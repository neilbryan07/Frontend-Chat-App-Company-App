import React from 'react'
import { Header } from '../Typogaphy/Header'

export const BackgroundAuth = ({ children, isWholePage = false }) => {
  return (
    <div class={`h-screen p-4 w-full flex flex-col items-center ${isWholePage ? 'justify-start' : 'justify-center'} relative bg-gray-50`}>
      {/*bg-gradient-to-r from-teal-300/25 via-gray-300/50 via-gray-300/50 to-teal-300/25*/}

      {/* <div className='absolute top-2 left-2'>
        <img
          className='w-[120px] h-[45px] block max-md:hidden'
          src={require('../../assets/images/NBPO_LOGO.png')}
          alt=''
        />

      </div> */}

      {children}


    </div>
  )
}
