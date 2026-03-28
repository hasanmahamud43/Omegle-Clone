'use client'
import React from 'react'

function Footer() {
  return (
    <div className="relative z-10 bg-black text-center py-6 text-xs text-zinc-500 border-b border-white/10">
      {`© ${new Date().getFullYear()} Icognito. All rights reserved.`}
    </div>
  )
}

export default Footer