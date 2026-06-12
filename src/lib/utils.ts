export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function parseSizeString(sizes: string): string[] {
  return sizes.split(",").map((s) => s.trim())
}

export function parseColorString(colors: string): string[] {
  return colors.split(",").map((c) => c.trim())
}

export function parseImageString(images: string): string[] {
  return images.split(",").map((i) => i.trim())
}
