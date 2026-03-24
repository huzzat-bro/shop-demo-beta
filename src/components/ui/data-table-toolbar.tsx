import { type Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    enableFiltering?: boolean
    enableColumnVisibility?: boolean
}

export function DataTableToolbar<TData>({
    table,
    enableFiltering,
    enableColumnVisibility,
}: DataTableToolbarProps<TData>) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {enableFiltering && (
                    <Input
                        placeholder="Filter emails..."
                        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn('email')?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-37.5 lg:w-62.5"
                    />
                )}
                {/* You can add more filters here */}
            </div>
            {enableColumnVisibility && <DataTableViewOptions table={table} />}
        </div>
    )
}