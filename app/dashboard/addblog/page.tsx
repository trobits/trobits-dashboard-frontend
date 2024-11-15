"use client"
import TextEditor from '@/components/editor/TextEditor'
import { Card } from '@/components/ui/card'
import React from 'react'

const page = () => {
  return (
    <div>
      <Card className="bg-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Blog Post</h2>

          {/* Text editor  */}
          <div className='w-full'>

          <TextEditor />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default page
