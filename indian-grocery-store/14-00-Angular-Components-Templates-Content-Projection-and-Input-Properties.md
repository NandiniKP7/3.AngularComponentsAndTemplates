# Angular Components & Templates — Content Projection and Input Properties

## Topics Covered

1. **Using Angular Content Projection**
2. **Passing Data to Child Components with Input Properties**
3. **Defining Input Property Types and Requirements**

---

# Component Relationship in This Lesson

This is the relationship to keep in mind throughout this README:

```text
CatalogComponent (parent)
      ↓
renders and passes data/content to
      ↓
ProductDetailsComponent (child)
```

and on the Cart page:

```text
CartComponent (parent)
      ↓
renders and passes data/content to
      ↓
ProductDetailsComponent (child)
```

So in this lesson:

```text
CatalogComponent
→ parent component

CartComponent
→ parent component

ProductDetailsComponent
→ child component
```

Why?

Because both parent components **use** `ProductDetailsComponent` in their templates:

```html
<store-product-details [product]="prod">
  ...
</store-product-details>
```

The component containing `<store-product-details>` is the **parent**.

`ProductDetailsComponent` is the **child** because it is being rendered inside that parent's template.

Important:

```text
ProductDetailsComponent is NOT the parent here.
```

It receives:

```text
DATA
→ through [product]="prod"

CONTENT
→ through the content placed between
  <store-product-details> ... </store-product-details>
```

So the direction is:

```text
CatalogComponent / CartComponent
        ↓
      parent
        ↓
passes data + projected content
        ↓
ProductDetailsComponent
        ↓
      child
```

---

# 1. Using Angular Content Projection

## Simple Concept

Content projection lets a parent component provide some HTML/content, while the child component decides **where that content should appear**.

```text
Parent component
→ provides content

Child component
→ provides reusable layout

<ng-content>
→ tells Angular where the parent's content should appear
```

---

## Why / When Do We Use Content Projection?

Use content projection when two places need the **same component layout**, but a small part of the UI should be different.

In your Indian Grocery Store, this was exactly the problem.

Before:

```text
CatalogComponent
→ ProductDetailsComponent
→ Buy button

CartComponent
→ CartItemComponent
→ Remove button
```

But `ProductDetailsComponent` and `CartItemComponent` were almost identical.

Both displayed:

```text
image
name
description
category
price
discount
```

The main difference was:

```text
Catalog page
→ Buy button

Cart page
→ Remove button
```

So instead of keeping two almost-identical components, you reused:

```text
ProductDetailsComponent
```

for both pages.

---

## Mental Model

```text
ProductDetailsComponent
→ owns the common product layout

CatalogComponent
→ supplies Buy button

CartComponent
→ supplies Remove button
```

The child decides where that supplied content appears by using:

```html
<ng-content></ng-content>
```

---

## Small Focused Syntax

Inside `ProductDetailsComponent`:

```html
<ng-content></ng-content>
```

Meaning:

```text
"Render the content passed by the parent here."
```

---

## Your CatalogComponent Example

`CatalogComponent` is the parent.

```html
<store-product-details [product]="prod">
  <button class="cta" (click)="addToCart(prod)">
    Buy
  </button>
</store-product-details>
```

Conceptually:

```text
CatalogComponent
      ↓ passes product data
ProductDetailsComponent
      ↓
projects Buy button at <ng-content>
```

Inside `ProductDetailsComponent`:

```html
<div class="price">
  ...
  <ng-content></ng-content>
</div>
```

Angular places the Buy button there.

---

## Your CartComponent Example

`CartComponent` uses the same child component:

```html
<store-product-details [product]="prod">
  <button class="cta" (click)="removeFromCart(prod)">
    Remove
  </button>
</store-product-details>
```

Now:

```text
CatalogComponent
→ Buy button

CartComponent
→ Remove button

ProductDetailsComponent
→ same reusable product layout
```

---

## Why the Full Opening and Closing Tag Matters

Before content projection, this works:

```html
<store-product-details [product]="prod" />
```

But when passing projected content, you need:

```html
<store-product-details [product]="prod">
  ...
</store-product-details>
```

because the projected content sits between the opening and closing tags.

---

## Where Does the Button Logic Belong?

The Buy button belongs to `CatalogComponent`, so its click logic moved there:

```ts
addToCart(prod: IProduct) {
  this.cartService.addItemsTocart(prod);
}
```

The Remove button belongs to `CartComponent`, so its click logic lives there:

```ts
removeFromCart(prod: IProduct) {
  this.cartService.removeItemsFromCart(prod);
}
```

So responsibility becomes:

```text
ProductDetailsComponent
→ reusable product UI

CatalogComponent
→ Buy behavior

CartComponent
→ Remove behavior
```

---

## Where Do Projected Content Styles Belong?

The projected button is defined by the parent.

So:

```text
Buy button styles
→ CatalogComponent CSS

Remove button styles
→ CartComponent CSS
```

Even though the button is displayed inside `ProductDetailsComponent`, the button itself belongs to the parent template.

---

## What Did This Refactor Remove?

Because `CartComponent` can now reuse `ProductDetailsComponent`:

```text
CartItemComponent
→ no longer needed
```

You deleted the old cart item component.

The design is now:

```text
CatalogComponent
        \
         \
          → ProductDetailsComponent
         /
        /
CartComponent
```

---

## Important Rule

Content projection means:

```text
Parent decides WHAT content to provide.

Child decides WHERE that content is rendered.
```

---

## Memory Rule

```text
Parent
→ provides content

Child
→ reusable layout

<ng-content>
→ projection point
```

---

# 2. Passing Data to Child Components with Input Properties

## Simple Concept

Content projection passes HTML/content.

Input properties pass **data** from a parent component to a child component.

```text
Parent component
→ data
→ child component
```

In your app, `CatalogComponent` has a product from its `@for` loop.

`ProductDetailsComponent` needs that product to display:

```text
name
description
category
price
image
discount
```

---

## Why / When Do We Use Input Properties?

Use an input when:

```text
a parent has data
AND
a child needs that data
```

In your app:

```text
CatalogComponent
→ has prod

ProductDetailsComponent
→ needs prod
```

and:

```text
CartComponent
→ has prod

ProductDetailsComponent
→ needs prod
```

---

## Your Actual Component Relationships

### Catalog Page

```text
CatalogComponent (parent)
      ↓ passes prod
ProductDetailsComponent (child)
```

### Cart Page

```text
CartComponent (parent)
      ↓ passes prod
ProductDetailsComponent (child)
```

---

## Small Focused Syntax

Parent template:

```html
<store-product-details [product]="prod">
</store-product-details>
```

Child component:

```ts
product = input.required<IProduct>();
```

Together:

```text
[product]="prod"
      ↓
ProductDetailsComponent.product
```

---

## What Do the Square Brackets Mean?

```html
[product]="prod"
```

The square brackets tell Angular:

```text
Evaluate `prod` as an Angular expression
and pass its actual value.
```

Here:

```text
prod
→ actual IProduct object
```

Without square brackets, Angular would treat a literal attribute value as text.

---

## When Are Square Brackets Not Needed?

If an input expects a literal string:

```html
<some-component name="Jim Cooper">
</some-component>
```

Angular passes:

```text
"Jim Cooper"
```

as a string.

But:

```html
<some-component [age]="5">
</some-component>
```

passes the number:

```text
5
```

Without brackets:

```html
age="5"
```

would be the string:

```text
"5"
```

---

## Why Your Product Needs Square Brackets

You need to pass:

```text
actual IProduct object
```

not:

```text
the string "prod"
```

So:

```html
[product]="prod"
```

is correct.

---

## What Makes `product` Bindable?

A normal class property is not automatically an Angular input.

The child explicitly declares:

```ts
product = input.required<IProduct>();
```

This tells Angular:

```text
"The parent is allowed to pass data into this property."
```

Without `input()` / `input.required()`, Angular does not treat the property as a bindable component input.

---

## Important Rule

```text
Parent:
[product]="prod"

Child:
product = input...
```

Both sides are required for parent-to-child data communication.

---

## Memory Rule

```text
Input property
→ parent-to-child DATA communication
```

```text
[]
→ evaluate expression
→ pass actual value
```

---

# 3. Defining Input Property Types and Requirements

## Simple Concept

An input should tell TypeScript:

```text
What type of value should come in?
AND
Is that value optional or required?
```

This gives the component type safety.

---

## Why / When Do We Define an Input Type?

Your `ProductDetailsComponent` expects a product.

So instead of accepting:

```text
any
```

it should accept:

```text
IProduct
```

That makes the expected contract clear.

---

## Your Actual Input

```ts
product = input.required<IProduct>();
```

Read it as:

```text
input
→ parent can pass data here

IProduct
→ data must match the product interface

required
→ parent must provide it
```

---

## Why `IProduct` Is Better Than `any`

With `any`:

```text
TypeScript cannot strongly validate what is passed.
```

With:

```ts
IProduct
```

TypeScript can verify that the value matches your product model.

So:

```text
IProduct
→ type contract between parent and child
```

---

## Optional Input

If you used:

```ts
product = input<IProduct>();
```

then the possible value is:

```text
IProduct | undefined
```

Why?

Because the parent may choose not to pass anything.

Then the child has to protect against:

```text
undefined
```

throughout the component and template.

---

## Why `required` Makes Sense Here

`ProductDetailsComponent` cannot do much without a product.

Without a product, it cannot display:

```text
name
image
description
category
price
```

So the product is not really optional.

That makes:

```ts
input.required<IProduct>()
```

a good fit.

Now Angular/TypeScript knows:

```text
ProductDetailsComponent always requires IProduct
```

---

## What Does `required` Protect?

### Inside ProductDetailsComponent

You can safely use:

```text
product()
```

as an `IProduct`.

You do not have to treat it as `undefined`.

### In CatalogComponent and CartComponent

If a parent tries:

```html
<store-product-details>
</store-product-details>
```

without `[product]`, Angular can report that the required input was not supplied.

---

## Your Actual Flow

`CatalogComponent`:

```html
<store-product-details [product]="prod">
  <button class="cta" (click)="addToCart(prod)">
    Buy
  </button>
</store-product-details>
```

`CartComponent`:

```html
<store-product-details [product]="prod">
  <button class="cta" (click)="removeFromCart(prod)">
    Remove
  </button>
</store-product-details>
```

Both satisfy:

```text
ProductDetailsComponent
requires
→ IProduct
```

---

## Important Rule

Ask:

```text
Can this child component work correctly without this input?
```

If yes:

```text
input<T>()
```

may be appropriate.

If no:

```text
input.required<T>()
```

is usually a better model.

For your `ProductDetailsComponent`:

```text
No product
→ no meaningful product details
```

So the input should be required.

---

## Memory Rule

```text
input<T>()
→ optional input
→ value may be undefined
```

```text
input.required<T>()
→ required input
→ parent must provide it
```

```text
<IProduct>
→ type safety
```

---

# How Everything Connects

## CatalogComponent

```text
products array
      ↓
@for gives prod
      ↓
[product]="prod"
      ↓
ProductDetailsComponent
```

At the same time:

```text
CatalogComponent
defines Buy button
      ↓
projects Buy button
      ↓
ProductDetailsComponent <ng-content>
```

So two different techniques are happening:

```text
[product]="prod"
→ passes DATA

Buy button inside component tags
→ passes CONTENT
```

---

## CartComponent

```text
cartItems Signal
      ↓
@for gives prod
      ↓
[product]="prod"
      ↓
ProductDetailsComponent
```

And:

```text
CartComponent
defines Remove button
      ↓
projects Remove button
      ↓
ProductDetailsComponent <ng-content>
```

---

## Final Reusable Design

```text
                    ProductDetailsComponent
                    ┌─────────────────────┐
                    │ image               │
                    │ name                │
                    │ description         │
                    │ category            │
                    │ price               │
                    │                     │
                    │ <ng-content>        │
                    └─────────────────────┘
                         ↑           ↑
                         │           │
                    Buy button   Remove button
                         │           │
                 CatalogComponent  CartComponent
```

Both parents also pass:

```text
IProduct
```

through the required input.

---

# Content Projection & Input Properties Cheat Sheet

```text
Content projection
→ parent provides HTML/content
→ child decides where it appears
```

```html
<ng-content></ng-content>
```

```text
CatalogComponent
→ projects Buy button

CartComponent
→ projects Remove button
```

```text
Input property
→ parent passes DATA to child
```

```html
[product]="prod"
```

```text
[]
→ evaluate Angular expression
→ pass actual value
```

```ts
product = input.required<IProduct>();
```

```text
input
→ bindable from parent

IProduct
→ required data type

required
→ parent must provide it
```

```text
CatalogComponent (parent)
→ passes IProduct
→ projects Buy

CartComponent (parent)
→ passes IProduct
→ projects Remove

ProductDetailsComponent (child)
→ reusable product layout
```

```text
DATA communication
→ input property

CONTENT communication
→ content projection
```
