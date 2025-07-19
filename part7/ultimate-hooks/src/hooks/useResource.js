// part7/ultimate-hooks/src/hooks/useResource.js

import { useState, useEffect } from 'react'
import axios from 'axios'

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(baseUrl)
        setResources(response.data)
      } catch (error) {
        console.log("Error fetching data:", error)
      }
    }

    fetchResources()
  }, [baseUrl])

  const create = async (resource) => {
    try {
      const response = await axios.post(baseUrl, resource)
      setResources((prevResources) => [...prevResources, response.data])
    } catch (error) {
      console.log("Error creating resource:", error)
    }
  }

  return [
    resources, { create }
  ]
}

export default useResource
