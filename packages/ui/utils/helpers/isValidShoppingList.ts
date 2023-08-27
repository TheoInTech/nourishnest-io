interface ShoppingItem {
  name: string
  qty: string
}

interface Shopping {
  category: string
  items: ShoppingItem[]
}

interface WeeklyShopping {
  week: number
  shopping: Shopping[]
}

function isValidShoppingList(data: any): boolean {
  if (Array.isArray(data)) {
    // Check if it's an array of WeeklyShopping objects
    return data.every((item: WeeklyShopping) => isValidWeeklyShopping(item))
  } else {
    // Check if it's a single WeeklyShopping object
    return isValidWeeklyShopping(data)
  }
}

function isValidWeeklyShopping(data: any): boolean {
  if (typeof data === 'object' && data !== null) {
    // Check if it has the 'week' and 'shopping' properties
    if ('week' in data && 'shopping' in data) {
      // Check if 'week' is a number
      if (typeof data.week === 'number') {
        // Check if 'shopping' is an array of Shopping objects
        if (Array.isArray(data.shopping)) {
          return data.shopping.every((item: Shopping) => isValidShopping(item))
        }
      }
    }
  }
  return false
}

function isValidShopping(data: any): boolean {
  if (typeof data === 'object' && data !== null) {
    // Check if it has the 'category' and 'items' properties
    if ('category' in data && 'items' in data) {
      // Check if 'category' is a string
      if (typeof data.category === 'string') {
        // Check if 'items' is an array of ShoppingItem objects
        if (Array.isArray(data.items)) {
          return data.items.every((item: ShoppingItem) =>
            isValidShoppingItem(item),
          )
        }
      }
    }
  }
  return false
}

function isValidShoppingItem(data: any): boolean {
  if (typeof data === 'object' && data !== null) {
    // Check if it has the 'name' and 'qty' properties
    return 'name' in data && 'qty' in data
  }
  return false
}

export default isValidShoppingList
