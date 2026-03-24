/* =====================================================
   GLOBAL
===================================================== */

export type ID = string

export type Expand<T, R> = T & Partial<R>

export type QueryResult<T> = {
    data?: T
    isLoading: boolean
    error?: Error
}

/* =====================================================
   CORE FILES / STREAMS
===================================================== */

export type File = {
    id: ID
    path: string
    url: string
}

export type Stream = {
    id: ID
    abortReason?: string
    clientId: string
    done?: boolean
    size?: number
}

/* =====================================================
   USERS
===================================================== */

export type User = {
    id: ID
    email?: string
    imageURL?: string
    name?: string
    role?: string
    type?: string
    createdAt?: Date
    updatedAt?: Date
}

export type UserRelations = {
    orders: Order[]
    image?: File
    linkedPrimaryUser?: User
    linkedGuestUsers: User[]
}

export type UserFull = Expand<User, UserRelations>

/* =====================================================
   BANNERS
===================================================== */

export type Banner = {
    id: ID
    active?: boolean
    createdAt?: Date
    image?: string
    link?: string
    subtitle?: string
    title?: string
}

export type PromotionalBanner = {
    id: ID
    active: boolean
    buttonText: string
    createdAt: Date
    image: string
    link: string
    order: number
    subtitle: string
    title: string
}

/* =====================================================
   CATEGORIES
===================================================== */

export type Category = {
    id: ID
    name: string
    slug: string
    description: string
    image?: string
    createdAt?: Date
    updatedAt?: Date
}

export type CategoryRelations = {
    parent?: Category
    children: Category[]
    products: Product[]
}

export type CategoryFull = Expand<Category, CategoryRelations>

/* =====================================================
   TAGS
===================================================== */

export type Tag = {
    id: ID
    name: string
}

/* =====================================================
   PRODUCTS
===================================================== */

export type Product = {
    id: ID

    name: string
    slug: string
    sku: string
    barcode: string

    description: string
    shortDescription: string

    price: number
    costPrice: number
    compareAtPrice?: number

    featured: boolean
    status: string

    weight: number
    width?: number
    height?: number
    length?: number

    stock?: number

    brand?: string
    taxClass?: string
    type?: string

    rating?: number
    reviewCount?: number

    metaTitle?: string
    metaDescription?: string

    createdAt?: Date | number
    updatedAt?: Date | number
}

/* =====================================================
   PRODUCT VARIANTS
===================================================== */

export type ProductVariant = {
    id: ID
    name: string
    options: Record<string, string>
    price: number
    quantity: number
    sku: string
    createdAt: Date
}

export type ProductVariantRelations = {
    product?: Product
}

export type ProductVariantFull =
    Expand<ProductVariant, ProductVariantRelations>

/* =====================================================
   PRODUCT RELATIONS
===================================================== */

export type ProductRelations = {
    images: File[]
    thumbnail?: File
    category?: Category
    variants: ProductVariant[]
    tags: Tag[]
    orderItems: OrderItem[]
}

export type ProductFull =
    Expand<Product, ProductRelations>

/* =====================================================
   ORDERS
===================================================== */

export type Order = {
    id: ID

    orderNumber: string

    email: string

    billingAddress: string
    shippingAddress: string

    paymentMethod: string
    paymentStatus: string

    status: string
    notes: string

    subtotal: number
    tax: number
    shipping: number
    discount: number
    total: number

    createdAt: Date
    updatedAt: Date
}

export type OrderRelations = {
    items: OrderItem[]
    user?: User
}

export type OrderFull =
    Expand<Order, OrderRelations>

/* =====================================================
   ORDER ITEMS
===================================================== */

export type OrderItem = {
    id: ID

    name: string
    image: string

    price: number
    quantity: number
    total: number

    sku: string
    createdAt: Date
}

export type OrderItemRelations = {
    product?: Product
    order?: Order
}

export type OrderItemFull =
    Expand<OrderItem, OrderItemRelations>

/* =====================================================
   NEWSLETTER
===================================================== */

export type NewsletterSubscriber = {
    id: ID
    email: string
    subscribed: boolean
    createdAt: Date
}

/* =====================================================
   TESTIMONIALS
===================================================== */

export type Testimonial = {
    id: ID

    name: string
    email: string

    company: string
    role: string

    content: string
    text?: string

    rating: number

    avatar?: string
    image: string

    approved: boolean
    createdAt: Date
}

/* =====================================================
   PAGE TYPES (DEEP RELATIONS)
===================================================== */

export type ProductPage = Product & {
    images: File[]
    thumbnail?: File
    category?: Category
    variants: ProductVariant[]
    tags: Tag[]
}

export type OrderPage = Order & {
    items: (OrderItem & {
        product?: Product
    })[]
}

export type CategoryPage = Category & {
    children?: Category[]
    parent?: Category
    products?: Product[]
}

/* =====================================================
   QUERY TYPES
===================================================== */

export type ProductsQuery =
    QueryResult<ProductFull[]>

export type OrdersQuery =
    QueryResult<OrderFull[]>

export type CategoriesQuery =
    QueryResult<CategoryFull[]>

export type UsersQuery =
    QueryResult<UserFull[]>

/* =====================================================
   DEEP TYPES (FULL EXPANSION)
===================================================== */

export type ProductDeep = Product & {
    images: File[]
    thumbnail?: File
    category?: Category & {
        parent?: Category
        children?: Category[]
    }
    variants: ProductVariant[]
    tags: Tag[]
}

export type OrderDeep = Order & {
    items: (OrderItem & {
        product?: Product
    })[]
    user?: User
}