"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { RefreshCwIcon, Scan } from "lucide-react"
import { useState } from "react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  handleScan(owner: string, repo: string): void;
  handleRefresh(owner: string, repo: string): void;
}

export function DataTableToolbar<TData>({
  table,
  handleScan,
  handleRefresh
}: DataTableToolbarProps<TData>) {
  const [repo, setRepo] = useState<string>("");
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Input
          placeholder="Repos to scan..."
          value={repo}
          onChange={(event) => setRepo(event.target.value)}
          className="h-8 mr-2 w-[150px] lg:w-[250px]"
        />
      <Button
          variant="outline"
          size="sm"
          className="ml-auto mr-2 hidden h-8 lg:flex"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {e.preventDefault(); handleScan(repo.split("/")[0], repo.split("/")[1])}}
        >
          <Scan className="mr-2 h-4 w-4" />
          Scan
      </Button>
      <Button
          variant="outline"
          size="sm"
          className="ml-auto mr-2 hidden h-8 lg:flex"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {e.preventDefault(); handleRefresh(repo.split("/")[0], repo.split("/")[1])}}
        >
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Refresh
      </Button>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  )
}
