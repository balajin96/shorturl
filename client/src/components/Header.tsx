import { FormEvent, useEffect, useRef } from "react"

type HeaderProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => Promise<void> | void
  isSubmitting?: boolean
  editingShortUrl?: string
  onCancelEdit?: () => void
}

const Header = ({ value, onChange, onSubmit, isSubmitting, editingShortUrl, onCancelEdit }: HeaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [editingShortUrl])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void onSubmit()
  }

  return (
    <header className="border-b border-gray-200 px-4 py-4">
      <form className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center" onSubmit={handleSubmit}>
        <label htmlFor="shorten-url" className="text-sm font-medium text-gray-600 sm:mr-3">
          Paste a URL:
        </label>
        <input
          id="shorten-url"
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com"
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {editingShortUrl ? "Update" : "Shorten"}
        </button>
        {editingShortUrl && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </form>
      {editingShortUrl && (
        <p className="mx-auto mt-2 max-w-4xl text-xs text-purple-600">
          Editing <span className="font-semibold">{editingShortUrl}</span> — submit to replace this target.
        </p>
      )}
    </header>
  )
}

export default Header
