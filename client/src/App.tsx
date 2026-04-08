import axios from "axios"
import { useCallback, useState } from "react"
import Header from "./components/Header"
import Table from "./components/Table"
import { API_BASE_URL } from "./config/api"
import type { FullUrl } from "./components/table/ColumnHeaders"
import { BrowserRouter } from 'react-router'
const App = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [formValue, setFormValue] = useState("")
  const [editingRow, setEditingRow] = useState<FullUrl | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const triggerRefresh = useCallback(() => setRefreshKey((curr) => curr + 1), [])

  const handleRequestEdit = useCallback((row: FullUrl) => {
    setEditingRow(row)
    setFormValue(row.fullUrl)
    setStatusMessage(`Editing ${row.shortUrl}`)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingRow(null)
    setFormValue("")
    setStatusMessage(null)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!formValue.trim()) {
      setStatusMessage("Please enter a URL to shorten.")
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      if (editingRow) {
        await axios.put(`${API_BASE_URL}/shorten/${editingRow._id}`, {
          fullUrl: formValue.trim(),
        })
        setStatusMessage("Short URL updated.")
      } else {
        await axios.post(`${API_BASE_URL}/shorten`, { fullUrl: formValue.trim() })
        setStatusMessage("Short URL created.")
      }
      triggerRefresh()
      setFormValue("")
      setEditingRow(null)
    } catch (error) {
      console.error("Error submitting URL:", error)
      if (axios.isAxiosError(error)) {
        setStatusMessage(error.response?.data?.message ?? error.message)
      } else if (error instanceof Error) {
        setStatusMessage(error.message)
      } else {
        setStatusMessage("Something went wrong while submitting the URL.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [editingRow, formValue, triggerRefresh])

  return (
    <BrowserRouter>
      <div className="flex flex-col bg-gray-50 min-h-screen">
        <Header
          value={formValue}
          onChange={setFormValue}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          editingShortUrl={editingRow?.shortUrl}
          onCancelEdit={handleCancelEdit}
        />
        {statusMessage && (
          <div className="mx-auto px-4 py-2 w-full max-w-6xl text-gray-600 text-sm">{statusMessage}</div>
        )}
        <main className="flex-1 px-4 pt-4 pb-8">
          <div className="mx-auto w-full max-w-6xl">
            <p className="font-medium text-gray-500 text-sm uppercase tracking-wide">List of Short URLs</p>
            <Table refreshKey={refreshKey} onRequestEdit={handleRequestEdit} />
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
