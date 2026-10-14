import { Chip } from '@mui/material'
import React, { useEffect, useState } from 'react'

const LabelUser = ({ name }) => {
  useEffect(() => { }, [])
  const [label, setLabel] = useState('');

  const getColor = name => {
    switch (name) {
      case '2':
        setLabel('Head')
        return 'info'
      case '1':
        setLabel('Admin')
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <Chip label={label} variant={'outlined'} color={getColor(name)} />
  )
}

export default LabelUser
