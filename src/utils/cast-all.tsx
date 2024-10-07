export function removeAll(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, '')
}

export function replaceNumeric(value: string): string {
  return value.replace(/\./g, '').replace(',', '.')
}
