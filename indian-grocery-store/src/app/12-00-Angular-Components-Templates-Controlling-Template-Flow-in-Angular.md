# Angular Components & Templates — Controlling Template Flow in Angular

> These notes follow the Pluralsight topic names and your Indian Grocery Store code.

## Topics Covered

1. **Getting Started**
2. **Handling Conditional Rendering**
3. **Aliasing a Conditional Expression's Value**
4. **Conditional Rendering with @Switch @Case**
5. **Creating Local Template Variables with @let**
6. **Using Template Reference Variables**
7. **Handling Limited Template Variable Scope**
8. **Using the @empty Fallback with @for**
9. **Efficient List Rendering with @for and track**
10. **Contextual Variables in @for Loops**

---

# 1. Getting Started

This course continues the component/template work from Angular Foundations.

In your Indian Grocery Store:

```text
CatalogComponent
      ↓
loops through products
      ↓
ProductDetailsComponent
      ↓
Buy
      ↓
CartService
      ↓
CartComponent
      ↓
CartItemComponent
```

The goal of this module is to make templates smarter and easier to manage:

```text
show different UI based on data
reuse values inside templates
reference template elements
render lists efficiently
```

---

# 2. Handling Conditional Rendering

## What does this concept mean?

Sometimes we want the UI to display **different content depending on the current data**.

That is conditional rendering.

Your understanding is exactly right:

```text
@if
@else if
@else

→ display things in different ways on the UI
depending on the condition
```

## Your ProductDetailsComponent Example

The current inventory decides which message the user sees:

```text
Inventory = 0
→ Out of stock

Inventory = 1
→ Only 1 product left

Inventory = 2–4
→ Only Few Left

Inventory >= 5
→ Get Yours Today
```

The important idea is:

```text
availableInventory changes
      ↓
Angular checks the conditions
      ↓
different HTML is displayed
```

## Syntax

```html
@if (condition) {
  <!-- show this -->
}
@else if (anotherCondition) {
  <!-- show this instead -->
}
@else {
  <!-- fallback -->
}
```

Your example:

```html
@if (availableInventory() == 1) {
  <span>Only 1 product left!</span>
}
@else if (availableInventory() < 1) {
  <span>Out of stock!</span>
}
@else if (availableInventory() < 5) {
  <span>Only Few Left!</span>
}
@else {
  <span>Get Yours Today!</span>
}
```

## One More Example Already in Your App

```html
@if (product().discount > 0) {
  <p>Sale price...</p>
}
```

Meaning:

```text
Product has discount
→ show discounted price

No discount
→ do not show it
```

### Remember

```text
@if / @else if / @else
→ choose what the user should see
```

---

# 3. Aliasing a Conditional Expression's Value

## What problem does aliasing solve?

Sometimes the expression used in `@if` is long, and we need the **same value again inside the block**.

Instead of repeating the full expression, Angular lets us give that value a shorter name.

This is an **alias**.

In your application:

```text
product().productNotes
```

would otherwise be used once to check the value and again to display it.

Instead:

```text
product().productNotes
      ↓
give it alias "notes"
      ↓
use notes inside the @if block
```

## Syntax

```html
@if (expression; as aliasName) {
  {{ aliasName }}
}
```

Your example:

```html
@if (product().productNotes; as notes) {
  <p>Product Notes: {{ notes }}</p>
}
```

Read it as:

```text
Check product().productNotes

If it has a value
→ call that value "notes"

Then use
→ notes
```

## Why is this useful?

Instead of:

```text
longExpression
longExpression
longExpression
```

you can use:

```text
longExpression
      ↓
short alias
```

## Important Scope Rule

`notes` is available only inside that primary `@if` block.

```text
@if block
→ notes exists

@else
→ notes does NOT exist

outside @if
→ notes does NOT exist
```

### Remember

```text
as
→ give the @if expression's value a shorter local name
```

---

# 4. Conditional Rendering with @Switch @Case

## What does this concept solve?

`@if` works well for conditions such as:

```text
inventory < 5
discount > 0
```

But sometimes one value can have several known possibilities.

Your example:

```text
category
→ Lentils
→ Beans
→ Grains
```

You want to display:

```text
Lentils → Lentil
Beans   → Bean
Grains  → Grain
```

This is where `@switch` is useful.

## Concept

```text
Take one value
      ↓
compare it with several cases
      ↓
display the matching case
```

## Syntax

```html
@switch (value) {

  @case ("A") {
    ...
  }

  @case ("B") {
    ...
  }

  @default {
    ...
  }
}
```

Your example:

```html
@switch (p.category) {
  @case ("Lentils") {
    Lentil
  }

  @case ("Beans") {
    Bean
  }

  @case ("Grains") {
    Grain
  }

  @default {
    {{ p.category }}
  }
}
```

## `@if` vs `@switch`

```text
@if
→ check conditions

@switch
→ compare one value against known choices
```

There is no `break` needed in Angular template `@switch`.

### Remember

```text
@if
→ "Is this condition true?"

@switch
→ "Which value do I have?"
```

---

# 5. Creating Local Template Variables with @let

## What problem does `@let` solve?

Sometimes the same value or expression is used repeatedly inside a template.

In `ProductDetailsComponent`, `product` is a Signal:

```ts
product = input.required<IProduct>();
```

So without a local variable, the template repeatedly uses:

```text
product().name
product().description
product().category
product().price
```

`@let` lets us store the result once under a shorter local name.

## Concept

```text
expression
      ↓
give it a local template name
      ↓
reuse that name
```

## Syntax

```html
@let variableName = expression;
```

Your example:

```html
@let p = product();
```

Now:

```text
product()
→ current product value

p
→ local name for that product
```

So:

```html
{{ p.name }}
{{ p.description }}
{{ p.price }}
```

is easier to read than repeatedly calling:

```html
{{ product().name }}
{{ product().description }}
{{ product().price }}
```

---

## `@let` Can Also Store a Calculation

Your example:

```html
@let discountedPrice =
  p.price * (1 - p.discount) | currency;
```

Then:

```html
{{ discountedPrice }}
```

Concept:

```text
long/repeated expression
      ↓
@let
      ↓
meaningful local name
```

### `as` vs `@let`

```text
as
→ alias specifically for an @if expression

@let
→ general local variable for a template expression
```

### Remember

```text
@let
→ make repeated or complex template expressions easier to read
```

---

# 6. Using Template Reference Variables

## What problem does this solve?

Sometimes we do not need a value from the component.

We need to reference an **actual element in the template**.

In `CartComponent`:

```text
Checkout button
→ can be far down the page

Proceed to Checkout
→ should scroll to that element
```

So Angular needs a way to identify that Checkout element.

## Concept

```text
HTML element
      ↓
give it a template reference name
      ↓
use that element elsewhere in the same template
```

## Syntax

Template reference variables use `#`:

```html
<button #checkout>
  Checkout
</button>
```

Now:

```text
checkout
→ reference to that button element
```

Your top button uses it:

```html
<button
  (click)="checkout.scrollIntoView({ behavior: 'smooth' })">
  Proceed to checkout
</button>
```

Important:

```text
#checkout
→ Angular template reference

scrollIntoView()
→ browser DOM method
```

### Remember

```text
@let
→ store a value

#variable
→ reference an element
```

---

# 7. Handling Limited Template Variable Scope

## What is scope?

Scope means:

```text
Where can this variable be used?
```

A variable created inside a control-flow block belongs only to that block.

Example:

```text
@if {
    #checkout exists here
}

outside
→ cannot access #checkout
```

This is why your first checkout implementation caused a problem.

## Your Fix

You moved the reference to an element outside the conditional block:

```html
<span #checkout>
  @if (hasCartItems) {
    <button class="cta">Checkout</button>
  }
</span>
```

Now:

```text
span
→ always exists

#checkout
→ always available

button
→ still shown only when cart has items
```

## Same Idea with `as`

```text
@if (...; as notes)
→ notes exists only inside that @if
```

## Same Idea with `@let`

If `@let` is created inside a block:

```text
that variable belongs to that block
```

### Remember

```text
Template variables have scope.

Created inside a block
→ usable only inside that block
```

---

# 8. Using the @empty Fallback with @for

## What problem does `@empty` solve?

`CartComponent` loops through:

```text
cartItems()
```

When there are items:

```text
show CartItemComponent
```

But when there are no items:

```text
@for has nothing to display
```

Instead of leaving the page blank, Angular gives `@for` an `@empty` fallback.

## Concept

```text
array has items
→ render the loop

array is empty
→ render the empty message
```

## Syntax

```html
@for (item of items; track item.id) {
  ...
}
@empty {
  ...
}
```

Your example:

```html
@for (prod of cartItems(); track prod.id) {
  <store-cart-items [product]="prod" />
}
@empty {
  <h2>You have no items in your cart</h2>
}
```

### Remember

```text
@empty
→ fallback UI when an @for collection has no items
```

---

# 9. Efficient List Rendering with @for and track

## What problem does `track` solve?

`CatalogComponent` renders many products:

```text
products array
      ↓
@for
      ↓
ProductDetailsComponent
ProductDetailsComponent
ProductDetailsComponent
...
```

Later, the array may change.

Angular needs to know:

```text
Which product is the same?
Which was removed?
Which was added?
Which moved?
```

That is why `track` is required.

## Concept

```text
Each item needs a stable identity
      ↓
Angular can recognize that item later
      ↓
Angular updates only what changed
```

## Best Choice in Your App

Each product has a unique ID:

```text
prod.id
```

So:

```html
@for (prod of products; track prod.id) {
```

means:

```text
Angular:
"Use prod.id to identify this product."
```

## Other Options

### `$index`

```text
track $index
→ identify item by its position
```

Useful mainly if the list order never changes.

### Object itself

```text
track prod
```

Angular compares object references.

The course discourages this because a stable unique ID is more efficient.

### Remember

```text
Best
→ unique ID

Static list only
→ $index

Avoid when possible
→ object reference
```

---

# 10. Contextual Variables in @for Loops

## What does this concept mean?

While Angular loops through a list, it already knows more than just the current item.

It also knows:

```text
what position is this item?
how many items are there?
is this an odd/even row?
is this the first item?
is this the last item?
```

Angular exposes those values as **contextual variables**.

## Important Contextual Variables

```text
$index
→ current position

$count
→ total number of items

$odd
→ true for odd index

$even
→ true for even index

$first
→ true for first item

$last
→ true for last item
```

## Syntax

```html
@for (
  prod of products;
  track prod.id;
  let indx = $index,
      count = $count,
      odd = $odd,
      first = $first
) {
  ...
}
```

This gives Angular's built-in values easier local names:

```text
$index → indx
$count → count
$odd   → odd
$first → first
```

---

## Your Examples

### Product Number

```html
Product {{ indx + 1 }} of {{ count }}
```

Why `+ 1`?

```text
$index starts at 0
```

So:

```text
0 + 1
→ Product 1
```

### Alternating Rows

```html
[class.alt]="odd"
```

Meaning:

```text
odd row
→ apply alt CSS class
```

### First Row

```html
[class.top]="first"
```

Meaning:

```text
first item
→ apply top class
```

### Remember

```text
Product data
→ comes from prod

Loop-position information
→ comes from contextual variables
```

---

# How Today's Topics Connect

```text
ProductDetailsComponent
      ↓
@if / @else if / @else
→ display different UI based on product/inventory data

@if (...; as notes)
→ shorten/reuse the conditional value

@switch / @case
→ display different output for known category values

@let
→ shorten/reuse template expressions
```

```text
CartComponent
      ↓
#checkout
→ reference an element

scope
→ determines where that reference can be used

@empty
→ display message when cartItems is empty
```

```text
CatalogComponent
      ↓
@for
→ display each product

track prod.id
→ tell Angular which product is which

contextual variables
→ use position/count/first/odd information
```

---

# Controlling Template Flow Cheat Sheet

```text
@if / @else if / @else
→ display different UI based on conditions
```

```text
@if (expression; as alias)
→ give a long/reused conditional value a shorter name
```

```text
@switch / @case / @default
→ choose UI based on one known value
```

```text
@let
→ create a local variable for a template expression
```

```text
#variable
→ reference an actual template element
```

```text
scope
→ controls where a template variable can be used
```

```text
@empty
→ fallback when an @for collection is empty
```

```text
track prod.id
→ uniquely identify each item for efficient rendering
```

```text
$index, $count, $odd, $even, $first, $last
→ information Angular already knows during an @for loop
```
