# Angular Components & Templates — Output Properties

## Topics Covered

1. **Preparing for Output Properties**
2. **Using Output Properties**

---

# Component Relationship in This Lesson

Keep this relationship in mind throughout the README:

```text
CatalogComponent (parent)
        ↓ passes product + mode
ProductDetailsComponent (child)
        ↑ sends addToCart event
CatalogComponent handles it
```

and:

```text
CartComponent (parent)
        ↓ passes product + mode
ProductDetailsComponent (child)
        ↑ sends removeFromCart event
CartComponent handles it
```

So:

```text
CatalogComponent
→ parent

CartComponent
→ parent

ProductDetailsComponent
→ child
```

---

# 1. Preparing for Output Properties

## Simple Concept

We already know how data moves **from parent to child**:

```text
Parent
→ Input
→ Child
```

Example:

```text
CatalogComponent
      ↓
[product]="prod"
      ↓
ProductDetailsComponent
```

But now we need communication in the opposite direction.

The child has a button:

```text
Buy
or
Remove
```

When the user clicks it, the child needs to tell the parent:

```text
"Something happened."
```

That is what an **output property** is for.

---

## Why / When Do We Use Output Properties?

Use an output when:

```text
an event happens inside the child
AND
the parent needs to know about it
```

Typical examples:

```text
button clicked
item selected
form submitted
row deleted
```

In your app:

```text
ProductDetailsComponent
→ Buy clicked
→ CatalogComponent should handle adding to cart
```

and:

```text
ProductDetailsComponent
→ Remove clicked
→ CartComponent should handle removing from cart
```

---

# Why the `mode` Input Was Added First

Before outputs, your buttons were being projected from the parent using content projection.

Now the course changes the design.

Instead of parents providing the button, `ProductDetailsComponent` itself decides which button to render.

So it gets a new input:

```ts
mode = input<'shop' | 'cart'>('shop');
```

Concept:

```text
mode = 'shop'
→ show Buy button

mode = 'cart'
→ show Remove button
```

This means the child now owns the button UI.

---

## Syntax

Inside `ProductDetailsComponent`:

```html
@if (mode() === 'shop') {
  <button class="cta" (click)="add()">Buy</button>
}
@else {
  <button class="cta" (click)="remove()">Remove</button>
}
```

Read it as:

```text
mode says shop?
→ show Buy

otherwise
→ show Remove
```

---

## Why Do We Still Need the Parent?

Even though the button is now inside `ProductDetailsComponent`, the parent may still need to handle what happens.

For example:

```text
Buy clicked
→ CatalogComponent may need analytics
→ CatalogComponent may call CartService
```

So the child should not always do everything itself.

Instead:

```text
Child detects event
      ↓
Child notifies parent
      ↓
Parent decides what to do
```

That is the purpose of outputs.

---

## Memory Rule

```text
Input
→ parent sends data DOWN to child

Output
→ child sends event UP to parent
```

---

# 2. Using Output Properties

## Simple Concept

An output property is a custom event created by the child component.

The child says:

```text
"Parent, this event happened."
```

and it can optionally send data with that event.

In your case:

```text
Buy clicked
→ emit product

Remove clicked
→ emit product
```

---

# The Most Important Part — There Are 3 Different Things

This is the part that felt confusing because the names are similar.

For the Buy flow, there are actually **three separate pieces**:

```text
1. add()
→ child method

2. addToCart
→ child output event

3. addToCart($event)
→ parent method call
```

They are not the same thing.

Let's separate them clearly.

---

## 1. `add()` — Method Inside ProductDetailsComponent

This runs when the child button is clicked.

```html
<button (click)="add()">Buy</button>
```

So:

```text
User clicks Buy
      ↓
ProductDetailsComponent.add()
```

`add()` is just a normal method in the child component.

Its job is:

```text
emit the output event
```

---

## 2. `addToCart` — Output Event Defined by ProductDetailsComponent

Inside the child:

```ts
addToCart = output<IProduct>();
```

This means:

```text
Create a custom event named addToCart

When it fires
→ it will send an IProduct
```

Think of it as:

```text
addToCart
→ event name
```

Not a method.

---

## 3. `emit()` — Child Sends the Event

Inside `add()`:

```ts
add() {
  this.addToCart.emit(this.product());
}
```

Read it slowly:

```text
this.addToCart
→ the custom output event

.emit(...)
→ fire that event

this.product()
→ send the current product with the event
```

So the child says:

```text
"Buy was clicked.
Here is the product."
```

---

# Complete Child-Side Buy Flow

```text
Buy button clicked
      ↓
add()
      ↓
addToCart.emit(...)
      ↓
IProduct sent to parent
```

---

# How the Parent Listens to the Output

In `CatalogComponent`:

```html
<store-product-details
  [product]="prod"
  (addToCart)="addToCart($event)">
</store-product-details>
```

There are two `addToCart` names here, but they mean different things.

---

## Left Side: `(addToCart)`

```html
(addToCart)
```

means:

```text
Listen for the child output event
named addToCart
```

This comes from:

```ts
addToCart = output<IProduct>();
```

inside `ProductDetailsComponent`.

---

## Right Side: `addToCart($event)`

```html
addToCart($event)
```

means:

```text
Call the CatalogComponent method
named addToCart
```

So:

```text
left side
→ child event

right side
→ parent method
```

---

# What Is `$event`?

When the child emits:

```ts
this.addToCart.emit(this.product());
```

the emitted product becomes:

```text
$event
```

in the parent template.

So:

```text
child emits IProduct
      ↓
parent receives it as $event
```

That means:

```html
(addToCart)="addToCart($event)"
```

is saying:

```text
When child fires addToCart
      ↓
take the emitted product ($event)
      ↓
pass it into CatalogComponent.addToCart(...)
```

---

# CatalogComponent Parent Method

Your parent method is:

```ts
addToCart(prod: IProduct) {
  this.cartService.addItemsTocart(prod);
}
```

So the complete flow is:

```text
User clicks Buy
      ↓
ProductDetailsComponent.add()
      ↓
ProductDetailsComponent emits addToCart
      ↓
product becomes $event
      ↓
CatalogComponent.addToCart($event)
      ↓
CartService.addItemsTocart(product)
```

---

# Why Are the Names So Confusing?

Because the course happens to use the same name:

```text
addToCart
```

for:

```text
child output event
AND
parent method
```

Angular does NOT require them to have the same name.

For example, conceptually this would also make sense:

```text
child output event
→ productAdded

parent method
→ addToCart(...)
```

The course simply used matching names.

So mentally read:

```html
(addToCart)="addToCart($event)"
```

as:

```text
(child event)
      ↓
(parent handler)
```

That is the easiest way to understand it.

---

# The Remove Flow Works the Same Way

Child output:

```ts
removeFromCart = output<IProduct>();
```

Child button:

```html
<button (click)="remove()">Remove</button>
```

Child method:

```ts
remove() {
  this.removeFromCart.emit(this.product());
}
```

Parent binding in `CartComponent`:

```html
<store-product-details
  [product]="prod"
  mode="cart"
  (removeFromCart)="removeFromCart($event)">
</store-product-details>
```

Parent method:

```ts
removeFromCart(prod: IProduct) {
  this.cartService.removeItemsFromCart(prod);
}
```

---

# Complete Remove Flow

```text
User clicks Remove
      ↓
ProductDetailsComponent.remove()
      ↓
removeFromCart.emit(product)
      ↓
product becomes $event
      ↓
CartComponent.removeFromCart($event)
      ↓
CartService.removeItemsFromCart(product)
```

---

# Why Use `output<IProduct>()`?

The type tells Angular/TypeScript:

```text
This event sends an IProduct.
```

So:

```ts
addToCart = output<IProduct>();
```

means:

```text
event name
→ addToCart

event data type
→ IProduct
```

If the event did not need to send data, the course explains that you could use:

```ts
output<void>()
```

Conceptually:

```text
output<void>()
→ notify parent only

output<IProduct>()
→ notify parent + send product
```

---

# `input()` vs `output()`

These are opposite directions.

## Input

```text
CatalogComponent
      ↓
[product]="prod"
      ↓
ProductDetailsComponent
```

```text
Parent → Child
```

## Output

```text
ProductDetailsComponent
      ↓
(addToCart)
      ↓
CatalogComponent
```

```text
Child → Parent
```

---

# Your Final Communication Flow

## Catalog Page

```text
CatalogComponent (parent)
      ↓
[product]="prod"
      ↓
ProductDetailsComponent (child)
      ↓
user clicks Buy
      ↓
add()
      ↓
addToCart.emit(product)
      ↓
(addToCart)="addToCart($event)"
      ↓
CatalogComponent handles product
```

---

## Cart Page

```text
CartComponent (parent)
      ↓
[product]="prod"
+ mode="cart"
      ↓
ProductDetailsComponent (child)
      ↓
user clicks Remove
      ↓
remove()
      ↓
removeFromCart.emit(product)
      ↓
(removeFromCart)="removeFromCart($event)"
      ↓
CartComponent handles product
```

---

# Current Code Check

Your pasted `remove()` currently has:

```ts
remove() {
  this.addToCart.emit(this.product());
}
```

Based on the course flow, this should be:

```ts
remove() {
  this.removeFromCart.emit(this.product());
}
```

Otherwise clicking Remove would emit the wrong event.

Also, on the Cart page, `ProductDetailsComponent` needs:

```html
mode="cart"
```

so it renders the Remove button instead of the default Buy button.

---

# Output Properties Cheat Sheet

```text
input()
→ parent → child
```

```text
output()
→ child → parent
```

```ts
addToCart = output<IProduct>();
```

```text
→ define child event
→ event carries IProduct
```

```ts
add() {
  this.addToCart.emit(this.product());
}
```

```text
add()
→ child method

addToCart
→ child output event

emit(product)
→ fire event and send product
```

```html
(addToCart)="addToCart($event)"
```

```text
LEFT addToCart
→ child output event

RIGHT addToCart(...)
→ parent method

$event
→ product emitted by child
```

```text
Buy flow

Button
→ add()
→ addToCart.emit(product)
→ $event
→ CatalogComponent.addToCart(product)
```

```text
Remove flow

Button
→ remove()
→ removeFromCart.emit(product)
→ $event
→ CartComponent.removeFromCart(product)
```

---

# One-Line Memory Rule

```text
Input sends data DOWN.

Output sends events UP.

emit() sends the event.

$event receives the emitted data in the parent.
```
