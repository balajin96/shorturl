import axios from "axios"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getColumns, FullUrl } from "./table/ColumnHeaders"
import { API_BASE_URL } from "../config/api"

type TableProps = {
  refreshKey: number
  onRequestEdit: (row: FullUrl) => void
}

const Table = ({ refreshKey, onRequestEdit }: TableProps) => {
  const [shortUrls, setShortUrls] = useState<FullUrl[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const fetchShortUrls = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(undefined)

    try {
      const response = await axios.get<{ message: string; data: FullUrl[] }>(`${API_BASE_URL}/shorten`, {
        signal,
      })
      setShortUrls(response.data.data ?? [])
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === "ERR_CANCELED") {
          return
        }
        setError(err.response?.data?.message ?? err.message ?? "Failed to fetch short URLs")
      } else if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void fetchShortUrls(controller.signal)
    return () => controller.abort()
  }, [fetchShortUrls, refreshKey])

  const refreshList = useCallback(() => {
    void fetchShortUrls()
  }, [fetchShortUrls])

  const columns = useMemo(
    () => getColumns({ onRefresh: refreshList, onRequestEdit }),
    [onRequestEdit, refreshList],
  )

  const table = useReactTable({
    data: shortUrls,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <section className="bg-white shadow-sm mt-6 rounded-lg ring-1 ring-gray-100 overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-gray-100 border-b">
        <div>
          <p className="font-medium text-gray-700 text-sm">Short URLs</p>
          <p className="text-gray-500 text-xs">Fetched from the server via /api/shorten</p>
        </div>
        <span className="font-semibold text-gray-600 text-sm">{shortUrls.length} records</span>
      </div>

      <div className="px-6 py-5">
        {isLoading ? (
          <div className="text-gray-500 text-sm">Loading short URLs...</div>
        ) : error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : shortUrls.length === 0 ? (
          <div className="text-gray-500 text-sm">No short URLs found yet.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-gray-700 text-sm text-left">
                <thead className="text-gray-500 text-xs uppercase tracking-wide">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-4 py-3 text-left">
                          {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <button
                              type="button"
                              className="flex items-center gap-1 font-semibold"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <span className="text-[10px] text-gray-400">
                                {header.column.getIsSorted() === "asc"
                                  ? "▲"
                                  : header.column.getIsSorted() === "desc"
                                    ? "▼"
                                    : "⇅"}
                              </span>
                            </button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="border-gray-100 border-t divide-y divide-gray-100">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 align-top">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-2 px-4 py-3 border-gray-100 border-t text-gray-600 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                  className="disabled:opacity-50 px-3 py-1 border border-gray-200 rounded font-semibold text-gray-600 text-xs uppercase tracking-wide"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                  className="disabled:opacity-50 px-3 py-1 border border-gray-200 rounded font-semibold text-gray-600 text-xs uppercase tracking-wide"
                >
                  Next
                </button>
                <span className="text-xs">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">Rows per page:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(event) => table.setPageSize(Number(event.target.value))}
                  className="px-2 py-1 border border-gray-200 rounded text-xs"
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <label className="text-xs">
                  Go to page:
                  <input
                    type="number"
                    min={1}
                    max={table.getPageCount() || 1}
                    value={table.getState().pagination.pageIndex + 1}
                    onChange={(event) => {
                      const nextPage = event.target.value ? Number(event.target.value) - 1 : 0
                      table.setPageIndex(Math.max(0, Math.min(nextPage, (table.getPageCount() || 1) - 1)))
                    }}
                    className="ml-1 px-2 py-1 border border-gray-200 rounded w-16 text-xs"
                  />
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Table
