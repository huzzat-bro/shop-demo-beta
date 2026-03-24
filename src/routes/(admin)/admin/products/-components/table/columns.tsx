"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { db } from "@/lib/db"
import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { toast } from "sonner"

type Product = {
    id: string;
    name: string;
    slug: string;
    sku: string;
    barcode: string;
    shortDescription: string;
    price: number;
    costPrice: number;
    featured: boolean;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    description: string;
    weight: number;
    stock?: number
    rating?: number
    length?: number;
    type?: string;
    height?: number;
    width?: number;
    brand?: string;
    compareAtPrice?: number;
    metaDescription?: string;
    metaTitle?: string;
    reviewCount?: number
    taxClass?: string;
    thumbnail: {
        id: string;
        path: string;
        url: string;
    }
}

export const productColumns: ColumnDef<Product>[] = [
    // 1. SELECT (Bulk Actions)
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableHiding: false,
        enableSorting: false,
        size: 50, // Keep narrow
    },

    // 2. PRODUCT (Image + Name + SKU Combined)
    {
        id: "product",
        header: "Product",
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                        {product.thumbnail?.url ? (
                            <img
                                src={product.thumbnail.url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs">No Img</div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium leading-none">{product.name}</span>
                        <span className="text-xs text-muted-foreground">{product.sku}</span>
                    </div>
                </div>
            );
        },
        enableSorting: true, // Sorts by Name usually
    },

    // 3. STATUS (Badge)
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            // Customize colors based on your status values (e.g., 'active', 'draft', 'archived')
            const variant = status === 'active' ? 'default' : status === 'draft' ? 'secondary' : 'outline';

            return (
                <Badge variant={variant} className="capitalize">
                    {status}
                </Badge>
            );
        },
    },

    // 4. PRICE (Formatted)
    {
        accessorKey: "price",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return <div className="font-medium">{formatted}</div>;
        },
    },

    // 5. STOCK (Inventory)
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.getValue("stock") as number | undefined;
            const isLowStock = stock !== undefined && stock < 10;

            return (
                <div className={isLowStock ? "font-medium text-red-500" : "text-muted-foreground"}>
                    {stock !== undefined ? stock : "∞"}
                    {isLowStock && <span className="ml-1 text-xs">(Low)</span>}
                </div>
            );
        },
    },

    // 6. ACTIONS
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'} className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                            <Copy className="mr-2 h-4 w-4" /> Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={async () => {
                            await db.transact(
                                db.tx.products[row.original.id].delete(),
                            )
                            toast.success("Deleted successfull")
                        }} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]