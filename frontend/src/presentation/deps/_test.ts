class StringCollector<Items extends string[] = []> {
    private items: Items;
  
    constructor(items: Items = ([] as unknown) as Items) {
      this.items = items;
    }
  
    /**
     * Adds a new string to the collector.
     * Returns a new StringCollector instance with the updated tuple type.
     * 
     * @param item - The string to add.
     * @returns A new StringCollector with the added item.
     */
    add<T extends string>(item: T): StringCollector<[...Items, T]> {
      // Create a new array with the existing items and the new item
      const newItems = [...this.items, item] as [...Items, T];
      return new StringCollector(newItems);
    }
  
    /**
     * Creates a tuple of the collected strings with literal types.
     * 
     * @returns A tuple containing all added strings as literal types.
     */
    create(): [...Items] {
      return this.items;
    }
  }

  // Create a new collector instance
const collector = new StringCollector()
.add('apple')
.add('banana')
.add('cherry');

// Create the typed tuple
const fruitTuple = collector.create();

// The type of fruitTuple is ['apple', 'banana', 'cherry']
// type FruitTuple = typeof fruitTuple;

// Usage demonstration
console.log(fruitTuple); // Output: ['apple', 'banana', 'cherry']

// TypeScript will enforce the literal types
// For example, the following assignment would cause a type error
// const invalidTuple: FruitTuple = ['apple', 'banana', 'date']; // Error
