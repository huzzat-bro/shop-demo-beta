import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/db"
import { type Table } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
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
    const [filterColumn, setFilterColumn] = useState("id");
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {enableFiltering && (
                    <div className="flex items-center">
                        <Select onValueChange={v => setFilterColumn(v)} defaultValue="id">
                            <SelectTrigger>
                                <SelectValue placeholder='Select an option' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="id">ID</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder={`Filter ${filterColumn}...`}
                            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(filterColumn)?.setFilterValue(event.target.value)
                            }
                            className="h-8 w-37.5 lg:w-62.5"
                        />
                    </div>
                )}
                {/* You can add more filters here */}
            </div>
            <div className="flex items-center gap-2">
                {table.getIsSomeRowsSelected() && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant={'destructive'}>
                                <Trash2 />
                                Bulk Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                    <Trash2 />
                                </AlertDialogMedia>
                                <AlertDialogTitle>Bluk Delete</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete all selected row.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel variant={'outline'}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async () => {
                                        const rows = table.getSelectedRowModel().flatRows
                                        rows.map(async (row) => {
                                            await db.transact(
                                                // @ts-ignore
                                                db.tx.products[row.original.id].delete()
                                            )
                                        });
                                        toast.success("All Selected rows deleted");
                                        table.resetRowSelection();
                                    }}
                                    variant={'destructive'}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                {enableColumnVisibility && <DataTableViewOptions table={table} />}
            </div>
        </div>
    )
}