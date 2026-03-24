// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react"

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $streams: i.entity({
      abortReason: i.string().optional(),
      clientId: i.string().unique().indexed(),
      done: i.boolean().optional(),
      size: i.number().optional(),
    }),
    $users: i.entity({
      createdAt: i.date().optional(),
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      name: i.string().optional(),
      role: i.string().optional(),
      type: i.string().optional(),
      updatedAt: i.date().optional(),
    }),
    banners: i.entity({
      active: i.boolean().optional(),
      createdAt: i.date().optional(),
      image: i.string().optional(),
      link: i.string().optional(),
      subtitle: i.string().optional(),
      title: i.string().optional(),
    }),
    categories: i.entity({
      createdAt: i.date().optional(),
      description: i.string(),
      image: i.string().optional(),
      name: i.string().unique(),
      slug: i.string().unique(),
      updatedAt: i.date().optional(),
    }),
    newsletterSubscribers: i.entity({
      createdAt: i.date(),
      email: i.string().unique(),
      subscribed: i.boolean(),
    }),
    orderItems: i.entity({
      createdAt: i.date(),
      image: i.string(),
      name: i.string(),
      price: i.number(),
      quantity: i.number(),
      sku: i.string(),
      total: i.number(),
    }),
    orders: i.entity({
      billingAddress: i.string(),
      createdAt: i.date().indexed(),
      discount: i.number(),
      email: i.string().indexed(),
      notes: i.string(),
      orderNumber: i.string().unique(),
      paymentMethod: i.string(),
      paymentStatus: i.string(),
      shipping: i.number(),
      shippingAddress: i.string(),
      status: i.string().indexed(),
      subtotal: i.number(),
      tax: i.number(),
      total: i.number(),
      updatedAt: i.date(),
    }),
    products: i.entity({
      barcode: i.string(),
      brand: i.string().optional(),
      compareAtPrice: i.number().optional(),
      costPrice: i.number(),
      createdAt: i.date().optional(),
      description: i.string(),
      featured: i.boolean().indexed(),
      height: i.number().optional(),
      length: i.number().optional(),
      metaDescription: i.string().optional(),
      metaTitle: i.string().optional(),
      name: i.string().indexed(),
      price: i.number(),
      rating: i.number().optional(),
      reviewCount: i.number().optional(),
      shortDescription: i.string(),
      sku: i.string().unique(),
      slug: i.string().unique().indexed(),
      status: i.string().indexed(),
      stock: i.number(),
      taxClass: i.string().optional(),
      type: i.string().optional(),
      updatedAt: i.date().optional(),
      weight: i.number(),
      width: i.number().optional(),
      inventory: i.json().optional(),
      specialOffer: i.string().optional()
    }),
    productVariants: i.entity({
      createdAt: i.date(),
      name: i.string(),
      options: i.any(),
      price: i.number(),
      quantity: i.number(),
      sku: i.string(),
    }),
    promotionalBanners: i.entity({
      active: i.boolean().indexed(),
      buttonText: i.string(),
      createdAt: i.date(),
      image: i.string(),
      link: i.string(),
      order: i.number(),
      subtitle: i.string(),
      title: i.string(),
    }),
    tags: i.entity({
      name: i.string().unique(),
    }),
    testimonials: i.entity({
      approved: i.boolean().indexed(),
      avatar: i.string().optional(),
      company: i.string(),
      content: i.string(),
      createdAt: i.date(),
      email: i.string(),
      image: i.string(),
      name: i.string(),
      rating: i.number(),
      role: i.string(),
      text: i.string().optional(),
    }),
  },
  links: {
    $streams$files: {
      forward: {
        on: "$streams",
        has: "many",
        label: "$files",
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "$stream",
        onDelete: "cascade",
      },
    },
    $usersImage: {
      forward: {
        on: "$users",
        has: "one",
        label: "image",
        onDelete: "cascade",
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "user",
        onDelete: "cascade",
      },
    },
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    $usersOrders: {
      forward: {
        on: "$users",
        has: "many",
        label: "orders",
      },
      reverse: {
        on: "orders",
        has: "one",
        label: "user",
      },
    },
    categoriesChildren: {
      forward: {
        on: "categories",
        has: "many",
        label: "children",
      },
      reverse: {
        on: "categories",
        has: "one",
        label: "parent",
      },
    },
    categoriesProducts: {
      forward: {
        on: "categories",
        has: "many",
        label: "products",
      },
      reverse: {
        on: "products",
        has: "one",
        label: "category",
      },
    },
    orderItemsProduct: {
      forward: {
        on: "orderItems",
        has: "one",
        label: "product",
      },
      reverse: {
        on: "products",
        has: "many",
        label: "orderItems",
      },
    },
    ordersItems: {
      forward: {
        on: "orders",
        has: "many",
        label: "items",
      },
      reverse: {
        on: "orderItems",
        has: "one",
        label: "order",
      },
    },
    productsImages: {
      forward: {
        on: "products",
        has: "many",
        label: "images",
      },
      reverse: {
        on: "$files",
        has: "many",
        label: "product",
      },
    },
    productsTags: {
      forward: {
        on: "products",
        has: "many",
        label: "tags",
      },
      reverse: {
        on: "tags",
        has: "many",
        label: "products",
      },
    },
    productsThumbnail: {
      forward: {
        on: "products",
        has: "one",
        label: "thumbnail",
        onDelete: "cascade",
      },
      reverse: {
        on: "$files",
        has: "many",
        label: "product-thumbnail",
      },
    },
    productsVariants: {
      forward: {
        on: "products",
        has: "many",
        label: "variants",
      },
      reverse: {
        on: "productVariants",
        has: "one",
        label: "product",
      },
    },
  },
  rooms: {},
})

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema
interface AppSchema extends _AppSchema { }
const schema: AppSchema = _schema

export type { AppSchema }
export default schema
