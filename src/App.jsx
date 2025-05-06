import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import SCPForm from './components/SCPForm'
import SCPCard from './components/SCPCard'
import Landing from './Landing'

const App = () => {
  const [entries, setEntries] = useState([])
  const [showMain, setShowMain] = useState(false)

  const fetchEntries = async () => {
    const { data, error } = await supabase.from('SCP-CRUD').select('*').order('created_at', { ascending: false })
    if (error) console.error(error)
    else setEntries(data)
  }

  useEffect(() => {
    if (showMain) fetchEntries()
  }, [showMain])

  if (!showMain) return <Landing onEnter={() => setShowMain(true)} />

  return (
    <div>
      <h1>SCP CRUD Portal</h1>
      <SCPForm onSubmit={fetchEntries} />
      <div className="grid">
        {entries.map((entry) => (
          <SCPCard key={entry.id} data={entry} onUpdate={fetchEntries} />
        ))}
      </div>
    </div>
  )
}

export default App
