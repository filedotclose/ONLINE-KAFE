"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
const Notfound = () => {
    const pathname = usePathname();
    const msg = pathname?.split("/")[0]
  return (
    <div>
        <h2>{msg} not found</h2>   
        <p>could not find the requested resource</p>
    </div>
  )
}

export default Notfound