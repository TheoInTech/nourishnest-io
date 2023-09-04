type EmojiMap = {
  [key: string]: string
}

export function appendEmoji(category: string): string {
  const emojiMap: EmojiMap = {
    protein: '🍗',
    dairy: '🥛',
    veg: '🥦',
    pantry: '🍞',
    fruit: '🍎',
    grain: '🍚',
    spice: '🌶️',
    beverage: '☕',
    snack: '🍪',
    sea: '🍤',
    bake: '🍩',
    frozen: '🍦',
    ready: '🍱',
    alcohol: '🍺',
    baby: '🍼',
    condiment: '🍯',
    pet: '🦴',
    health: '💄',
    household: '🧹',
    oil: '🍶',
    pasta: '🍝',
  }

  const emoji = findClosestEmoji(category, emojiMap)
  return `${category} ${emoji}`
}

function findClosestEmoji(category: string, emojiMap: EmojiMap): string {
  for (const key in emojiMap) {
    if (category.toLowerCase().includes(key)) {
      return emojiMap[key]
    }
  }
  return '❓'
}
