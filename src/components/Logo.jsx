import React from 'react'

export default function Logo({ size = 34 }) {
  return (
    <img
      src="/logo.jpg"
      alt="Spider Gaming 2.0"
      width={size}
      height={size}
      style={{ objectFit: 'contain', borderRadius: '50%' }}
    />
  )
}