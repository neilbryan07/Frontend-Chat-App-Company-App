import React from 'react'

export const Header = ({ text, style }) => {
  return (
    <div className={`${style} text-black text-xl font-medium antialiased `}>{text}</div>
  )
}
