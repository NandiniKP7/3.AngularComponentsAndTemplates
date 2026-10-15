# Angular Components & Templates — Model Inputs, Input Transforms, and Shared Services

## Topics Covered

1. **Two-way Binding with Model Inputs**
2. **Using Implicit Change Events for Model Inputs**
3. **Transforming Input Property Values**
4. **Cross-component Communication with Services**

---

# Component Relationships in This Lesson

For the slider example:

```text
ProductDetailsComponent
→ parent

SlidderComponent
→ child
```

The relationship is:

```text
ProductDetailsComponent (parent)
        ↕
[(slidderValue)]="favorite"
        ↕
SlidderComponent (child)
```

For shared inventory, the components are **not directly parent/child communicating with each other**.

Instead:

```text
CatalogComponent
CartComponent
ProductDetailsComponent
        ↓
use shared services
        ↓
CartService / InventoryService
```

---

# 1. Two-way Binding with Model Inputs

## Simple Concept

So far:

```text
input()
→ parent sends data DOWN to child

output()
→ child sends an event UP to parent
```

A model input is different:

```text
model()
→ lets the same value move in BOTH directions
```

So:

```text
Parent ↔ Child
```

This is useful when both components need to work with the same changing value.

---

## Why / When Do We Use a Model Input?

Your new `SlidderComponent` has a slider value.

You want two things:

```text
ProductDetailsComponent
→ should set the slider's starting value

SlidderComponent
→ should update the parent's value when user moves slider
```

That means:

```text
parent → child
AND
child → parent
```

A normal `input()` only gives the first direction.

A normal `output()` only gives the second direction.

A `model()` is designed for this two-way case.

---

## Your SlidderComponent

```ts
export class SlidderComponent {
  slidderValue = model(0);
}
```

Conceptually:

```text
slidderValue
→ model Signal

0
→ default value

model()
→ supports two-way binding
```

Like other Signal-based inputs, it is still a Signal.

So the child reads it with:

```ts
slidderValue()
```

and changes it with:

```ts
slidderValue.set(...)
```

---

## Your Slider Template

```html
<input
  #slidder
  type="range"
  [value]="slidderValue()"
  (input)="slidderValue.set(+slidder.value)"
  min="1"
  max="5"
/>
```

The important concept is:

```text
slidderValue()
→ current model value goes INTO the HTML slider

user moves slider
→ input event fires

slidderValue.set(...)
→ new slider value goes BACK into the model
```

So inside `SlidderComponent`:

```text
model value ↔ HTML range input
```

---

## Why `+slidder.value`?

HTML input values are strings by default.

So:

```text
slidder.value
→ string
```

The unary `+` converts it to a number:

```text
+"3"
→ 3
```

That keeps `slidderValue` numeric.

---

## Parent Side — ProductDetailsComponent

The parent has:

```ts
favorite = signal(0);
```

Then the template uses:

```html
<store-slidder [(slidderValue)]="favorite" />
```

This is the important two-way binding syntax.

---

## What Does `[(slidderValue)]` Mean?

Think of:

```text
[]
→ parent → child

()
→ child → parent
```

Combined:

```text
[()]
→ both directions
```

So:

```html
[(slidderValue)]="favorite"
```

means:

```text
ProductDetailsComponent.favorite
        ↓
sets child slider value

SlidderComponent.slidderValue
        ↑
updates parent favorite value
```

---

## Why `favorite` and Not `favorite()`?

This is important.

```text
favorite
→ Signal itself

favorite()
→ current number inside the Signal
```

For two-way model binding, Angular needs the **Signal itself** so it can both read and update it.

So use:

```html
[(slidderValue)]="favorite"
```

not:

```html
[(slidderValue)]="favorite()"
```

---

## Your Full Flow

Suppose:

```ts
favorite = signal(3);
```

Then:

```text
ProductDetailsComponent.favorite = 3
      ↓
SlidderComponent starts at 3
      ↓
user moves slider to 5
      ↓
slidderValue changes to 5
      ↓
favorite changes to 5
      ↓
Favorite Ranking displays 5
```

---

## Important Rule

Use `model()` when:

```text
parent must provide a value
AND
child must update that same value
```

---

## Memory Rule

```text
input()
→ Parent → Child

output()
→ Child → Parent

model()
→ Parent ↔ Child
```

```text
[(...)]
→ two-way binding
```

---

# 2. Using Implicit Change Events for Model Inputs

## Simple Concept

Two-way binding keeps the parent and child values synchronized.

But sometimes the parent also wants to **run some code whenever the model value changes**.

For example:

```text
slider changes
→ update favorite automatically
AND
→ log the new value
```

Angular gives model inputs an automatic change event for this.

---

## Why / When Do We Use the Change Event?

Two-way binding:

```html
[(slidderValue)]="favorite"
```

is perfect for keeping values synchronized.

But this alone does not clearly express:

```text
"When the slider changes,
also run this parent method."
```

For that, Angular automatically provides:

```text
slidderValueChange
```

because your model property is named:

```text
slidderValue
```

---

## Model Input Creates an Implicit Event

You define:

```ts
slidderValue = model(0);
```

Angular automatically gives you a corresponding change event:

```text
slidderValue
→ model value

slidderValueChange
→ emitted when the model value changes
```

You did not manually create:

```ts
output<number>()
```

for this.

Angular provides it automatically.

---

## Parent Template

```html
<store-slidder
  [(slidderValue)]="favorite"
  (slidderValueChange)="handleSlidderValueChange($event)"
/>
```

There are two things happening:

```text
[(slidderValue)]="favorite"
→ keep parent and child synchronized

(slidderValueChange)="..."
→ run additional parent code when it changes
```

---

## What Is `$event` Here?

The child model changed to a new number.

That new number becomes:

```text
$event
```

So:

```html
(slidderValueChange)="handleSlidderValueChange($event)"
```

means:

```text
slider model changed
      ↓
new number becomes $event
      ↓
call parent method with that number
```

---

## Your Parent Method

```ts
handleSlidderValueChange(newValue: number) {
  console.log('Value of slidder:', newValue);
}
```

Flow:

```text
user moves slider to 4
      ↓
slidderValue becomes 4
      ↓
favorite becomes 4
      ↓
slidderValueChange emits 4
      ↓
$event = 4
      ↓
handleSlidderValueChange(4)
```

---

## Important Rule

`model()` gives you both:

```text
a two-way bindable model value
AND
an automatic <modelName>Change event
```

---

## Memory Rule

```text
slidderValue = model(0)
```

automatically gives:

```text
slidderValue
slidderValueChange
```

```text
$event
→ new model value
```

---

# 3. Transforming Input Property Values

## Simple Concept

Sometimes the parent passes a value that is valid in type, but not in the format the child expects.

An input transform lets the child:

```text
receive incoming value
      ↓
clean / normalize / convert it
      ↓
use the corrected value internally
```

---

## Why / When Do We Use Input Transforms?

Your product discount is supposed to be stored as a decimal:

```text
0.20
→ 20% discount
```

But someone could accidentally provide:

```text
20
```

instead of:

```text
0.20
```

Without correction:

```text
price calculation
→ becomes wrong
```

So `ProductDetailsComponent` normalizes the product as it comes in.

---

## Your Transform

```ts
product = input.required<IProduct, IProduct>({
  transform: this.normalizeDiscount
});
```

Conceptually:

```text
Parent passes IProduct
      ↓
normalizeDiscount(...)
      ↓
ProductDetailsComponent receives normalized IProduct
```

---

## Your `normalizeDiscount()` Method

```ts
normalizeDiscount(product: IProduct) {
  if (product.discount < 1) {
    return product;
  }

  return {
    ...product,
    discount: product.discount / 100
  };
}
```

Read it as:

```text
discount already less than 1?
→ already decimal
→ return product as-is

discount >= 1?
→ assume whole-number percentage
→ divide by 100
→ return corrected product
```

Example:

```text
20
      ↓
20 / 100
      ↓
0.20
```

---

## Why Return a New Product Object?

This line:

```ts
return {
  ...product,
  discount: product.discount / 100
};
```

means:

```text
...product
→ copy all existing product properties

discount: ...
→ replace only discount

{}
→ create a new product object
```

So the original incoming object is not directly mutated.

---

## Why Are There Two Types Here?

```ts
input.required<IProduct, IProduct>(...)
```

When an input uses a transform, Angular may need to know two types:

```text
first type
→ type used INSIDE the child

second type
→ type accepted FROM the parent
```

In your example both are:

```text
IProduct
```

because:

```text
parent sends IProduct
transform returns IProduct
```

But conceptually they could be different.

---

## Important Rule

Use an input transform when:

```text
incoming value needs normalization or conversion
before the child uses it
```

The transform happens at the component boundary.

---

## Memory Rule

```text
Parent value
→ input transform
→ safe internal value
```

```text
input.required<InternalType, IncomingType>()
```

---

# 4. Cross-component Communication with Services

## Simple Concept

Inputs, outputs, and model inputs work well when components have a direct parent/child relationship.

But sometimes multiple parts of the application need the **same state**.

That is where a shared service is useful.

---

## Why / When Do We Use a Service?

Your inventory exposed a real problem.

Before:

```ts
availableInventory = signal(5);
```

lived inside each `ProductDetailsComponent`.

That meant every instance had its own separate value.

So:

```text
Catalog page ProductDetailsComponent
→ inventory might become 4

Cart page ProductDetailsComponent
→ another instance
→ inventory still starts at 5
```

The two screens were not sharing the same inventory state.

---

## The Real Problem

```text
Inventory belongs to the PRODUCT,
not to one particular component instance.
```

So the state needs to live somewhere shared.

That is the purpose of `InventoryService`.

---

## Mental Model

Before:

```text
ProductDetailsComponent instance A
→ own inventory

ProductDetailsComponent instance B
→ own inventory
```

After:

```text
              InventoryService
              shared inventory
                 ↑       ↑
                 │       │
        component A   component B
```

Now both component instances read the same source of truth.

---

# InventoryService

The service stores inventory for all products.

Conceptually:

```text
product ID
→ inventory count
```

Example:

```text
1 → 5
2 → 5
3 → 5
```

The service keeps this in one shared Signal.

---

## Why `Record<number, number>`?

Your service uses:

```ts
Record<number, number>
```

Conceptually:

```text
key
→ product ID

value
→ inventory number
```

So:

```text
Record<number, number>
```

means:

```text
number key
→ number value
```

---

## Initial Inventory

Your service builds initial inventory from all products:

```text
allProducts
      ↓
reduce()
      ↓
one object
      ↓
every product ID starts at 5
```

Example result:

```text
{
  1: 5,
  2: 5,
  3: 5
}
```

That object becomes the initial value of the shared inventory Signal.

---

# The Three Public Inventory Operations

The important service API is:

```text
get(productId)
→ read inventory

decrement(productId)
→ reduce inventory

increment(productId)
→ increase inventory
```

---

## `get()`

```ts
get(productId: number) {
  return this.allInventory()[productId];
}
```

Concept:

```text
give product ID
→ return that product's current inventory
```

---

## `decrement()`

```ts
decrement(productId: number) {
  this.allInventory.update(i => ({
    ...i,
    [productId]: i[productId] - 1
  }));
}
```

Concept:

```text
copy current inventory object
      ↓
change only selected product ID
      ↓
subtract 1
      ↓
save new object
```

---

## `increment()`

Same idea:

```text
selected product inventory
→ +1
```

used when an item is removed from the cart.

---

# Why CartService Updates Inventory

`CartService` already owns the action:

```text
add product to cart
remove product from cart
```

So it coordinates inventory changes too.

Your flow is:

```text
addItemsTocart(product)
      ↓
InventoryService.decrement(product.id)
      ↓
CartService updates cart
```

and:

```text
removeItemsFromCart(product)
      ↓
InventoryService.increment(product.id)
      ↓
CartService updates cart
```

This keeps:

```text
cart
+
inventory
```

synchronized.

---

# How ProductDetailsComponent Reads Shared Inventory

Instead of:

```ts
availableInventory = signal(5);
```

you now use:

```ts
availableInventory =
  computed(() =>
    this.inventoryService.get(this.product().id)
  );
```

Conceptually:

```text
current product ID
      ↓
InventoryService.get(...)
      ↓
current shared inventory
      ↓
computed availableInventory
```

Because the service state is reactive:

```text
inventory changes
      ↓
computed() recalculates
      ↓
ProductDetailsComponent UI updates
```

---

# Complete Shared-State Flow

## User Clicks Buy

```text
ProductDetailsComponent
      ↓
emits addToCart
      ↓
CatalogComponent
      ↓
CartService.addItemsTocart(product)
      ↓
InventoryService.decrement(product.id)
      ↓
shared inventory Signal changes
      ↓
availableInventory computed() updates
      ↓
Catalog UI updates
      ↓
Cart page reads the SAME inventory state
```

---

## User Clicks Remove

```text
ProductDetailsComponent
      ↓
emits removeFromCart
      ↓
CartComponent
      ↓
CartService.removeItemsFromCart(product)
      ↓
InventoryService.increment(product.id)
      ↓
shared inventory Signal changes
      ↓
all ProductDetailsComponent instances see updated value
```

---

## Important Concept — This Is Indirect Communication

`CatalogComponent` is not directly sending inventory to `CartComponent`.

Instead:

```text
CatalogComponent
      ↓
shared service state
      ↑
CartComponent
```

So the service acts as a shared source of truth.

That is why this is an **indirect form of cross-component communication**.

---

## When Should You Think About a Service?

Ask:

```text
Does this state belong to only one component?
→ component state may be enough

Do multiple components need the same state?
→ shared service is a strong option
```

For inventory:

```text
Catalog page needs it
Cart page needs it
multiple ProductDetailsComponent instances need it
```

So a service is appropriate.

---

## Important Rule

```text
Shared state
→ should not be duplicated in every component instance
```

Instead:

```text
one shared service
→ one source of truth
```

---

## Memory Rule

```text
Input / Output / Model
→ direct component communication

Service
→ shared state used by multiple components
→ indirect communication
```

---

# How Everything Connects

## Slider

```text
ProductDetailsComponent (parent)
      ↕
[(slidderValue)]="favorite"
      ↕
SlidderComponent (child)
```

```text
model()
→ two-way value sharing
```

---

## Model Change Event

```text
slidderValue changes
      ↓
slidderValueChange
      ↓
$event
      ↓
ProductDetailsComponent handler
```

---

## Product Input Transform

```text
CatalogComponent / CartComponent
      ↓
IProduct
      ↓
normalizeDiscount()
      ↓
safe IProduct
      ↓
ProductDetailsComponent
```

---

## Shared Inventory

```text
CatalogComponent
      ↓
CartService
      ↓
InventoryService
      ↑
ProductDetailsComponent
      ↑
CartComponent
```

The service keeps inventory consistent everywhere.

---

# Model Inputs, Transforms & Services Cheat Sheet

```text
model()
→ parent ↔ child
```

```html
[(slidderValue)]="favorite"
```

```text
[()]
→ two-way binding
```

```text
favorite
→ Signal itself

favorite()
→ current value
```

```text
model input
→ automatically creates <name>Change event
```

```html
(slidderValueChange)="handleSlidderValueChange($event)"
```

```text
$event
→ new model value
```

```text
Input transform
→ normalize incoming parent data
before child uses it
```

```ts
input.required<InternalType, IncomingType>({
  transform: ...
})
```

```text
Service
→ shared state
→ multiple components use same source of truth
```

```text
Before:
each ProductDetailsComponent
→ own inventory

After:
InventoryService
→ one shared inventory state
```

```text
Input
→ Parent → Child

Output
→ Child → Parent

Model
→ Parent ↔ Child

Service
→ shared state across components
```
