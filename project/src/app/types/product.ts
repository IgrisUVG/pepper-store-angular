export enum ProductType {
  CHILLY = "chilly",
  SPICE = "spice",
  SAUCE = "sauce",
  BLEND = "blend",
  EXTRACT = "extract",
}

export enum HeatLevel {
  LOWEST = "s",
  MEDIUM = "m",
  HIGHER = "l",
  HIGH = "xl",
}

export interface Product {
  id: string,
  documentId: string,
  name: string,
  price: {
    value: number,
    currency: "USD" | "EUR" | "GBP",
  },
  description: string,
  image: {
    url: string,
  },
  // NB! Scale 1..10
  rating: number,
  heatLevel: HeatLevel,
  type: ProductType,
}

export interface ProductFull extends Product {
  unit: string,
  fullDescription: string,
  technicalSpecifications: {
    title: string,
    description: string,
  }[],
  image: {
    url: string,
  },
  reviews: {
    rating: number, // 1..5
    title: string,
    text: string,
  }[],
}
