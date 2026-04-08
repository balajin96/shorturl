import { createColumnHelper } from "@tanstack/react-table"
import axios from "axios"
import { API_BASE_URL } from "../../config/api"
import { Link } from "react-router"
export type FullUrl = {
  _id: string
  fullUrl: string
  clicks: number
  shortUrl: string
  createdAt: string
  updatedAt: string
  __v: number
}

const columnHelper = createColumnHelper<FullUrl>()

type TableColumnCallbacks = {
  onRefresh: () => void
  onRequestEdit: (row: FullUrl) => void
}

export const getColumns = ({ onRefresh, onRequestEdit }: TableColumnCallbacks) => [
  columnHelper.accessor("fullUrl", {
    header: "Full URL",
    cell: (info) => info.getValue().substring(0, 50) + "...",
  }),

  columnHelper.accessor("shortUrl", {
    header: "Short URL",
    cell: (info) => (
      <Link to={`${API_BASE_URL}/${info.getValue()}`} target="_blank" rel="noreferrer noopener">
        <span className="text-blue-400 hover:cursor-pointer">
          {info.getValue()}
        </span>
      </Link>),
  }),
  // columnHelper.accessor("clicks", {
  //   header: "Clicks",
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (info) => {
      const row = info.row.original

      const handleEdit = () => {
        onRequestEdit(row)
      }

      const handleDelete = () => {
        if (confirm(`Delete short URL "${row.shortUrl}"?`)) {
          axios
            .delete(`${API_BASE_URL}/shorten/${row._id}`)
            .then(() => onRefresh())
            .catch((error) => {
              console.error("Error deleting short URL:", error)
            })
        }
      }

      return (
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm"
          >
            Delete
          </button>
        </div>
      )
    },
  }),
]
