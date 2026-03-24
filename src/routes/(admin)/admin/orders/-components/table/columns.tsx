import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react";



export type OrderTable = {
    id: string;
    createdAt: Date;
    email: string;
    updatedAt: Date;
    total: number;
    billingAddress: string;
    discount: number;
    notes: string;
    orderNumber: string;
    paymentMethod: string;
    paymentStatus: string;
    shipping: number;
    shippingAddress: string;
    status: string;
    subtotal: number;
    tax: number;
}



export const ordersColumns: ColumnDef<OrderTable>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={
                    row.getIsSelected()
                }
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableHiding: false,
        enableSorting: false
    },

    {
        accessorKey: "orderNumber",
        header: "Order Number"
    },
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "shipping",
        header: "Shipping"
    },
    {
        accessorKey: "paymentStatus",
        header: "Payment Satus"
    },
    {
        accessorKey: "status",
        header: "Status"
    },
    {
        accessorKey: "subtotal",
        header: "Sub Total"
    },
    {
        accessorKey: "total",
        header: "Total"
    },
    {
        accessorKey: 'createdAt',
        header: "Created At",
        cell: ({ row }) => (
            <p>{new Date(row.getValue('createdAt')).getDate()}</p>
        )
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'} size={'icon'}><MoreHorizontal /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Edit /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { console.log(order.id) }} className="text-destructive">
                            <Trash2 /> Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Copy /> Copy ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }

]