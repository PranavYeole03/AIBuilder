import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useState } from 'react'

const LiveSite = () => {
  const { id } = useParams();
  const [html, setHtml] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-by-slug/${id}`,)
        setHtml(result.data.latestCode)
        console.log(result)
      } catch (error) {
        setError("site not found")
        console.log(error)
      }
    }
    handleGetWebsite()
  }, [id])
  if (error) {
    <div className='h-screen flex items-center justify-center bg-black text-white'>
      {error}
    </div>
  }
  return (
    <iframe title='Live Site' srcDoc={html} className='w-screen h-screen border-none' sandbox='allow-scripts allow-same-origin allow-forms' />
  )
}

export default LiveSite
