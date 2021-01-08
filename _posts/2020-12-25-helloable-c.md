---
layout: post
title: Helloable.c
permalink: /blog/helloable-c
date: 2020-12-25 12:00 AM
---

I want to write a little bit about object oriented C, and how to
implement patterns seen in languages like C++ in C, hopefully without
sacrificing performance or elegance. I created [helloable.c](https://gist.github.com/xianbaum/463f13a8d39014131b3f4fa67a241119)
as a C interface implementation for comparable C++, in [helloable.cpp](https://gist.github.com/xianbaum/1407f6a63ed826e4f42e7100c38977e9).

C programmers usually code to interfaces in three ways: One, they use #ifdef drop-in
implementations, two, function pointers in structs, or three, a pointer to a vtable.
My implementation uses a vtable, but my implementation also goes an extra step to minimize CPU instructions
to match the C++ equivalent implementation.
that is fully comparable to how interfaces work in languages like Java. One reason
might be that interfaces have overhead. While coding a web app in Java,
you might code to an interface without giving a second thought. But coding for embedded
systems or legacy machines, you might want to consider something else.
Overhead can be avoided entirely if implementations are swapped out using ifdefs at
compile time. I take advantage of this in [cngine](https://gitlab.com/xianbaum/cngine).
However, that doesn't satisfy every reason to use an interface in object oriented languages.

Requirements of the implementation:
- Be at least partially encapsulated, as much as C allows
- Be able to be contained in a collection of other types without sacrificing functionality
- Cast to and from the interface
- Generate comparable assembly to a C++ implementation

Three years ago, I made an effort to get close to C++ implementation down to the assembly,
without being ugly and keeping abstractions as much as C allows.

## Single inheritance in C

```c
typedef struct
{
  Being base;
  char *breed;
} Animal;
```

Single inheritance is very simple in C. The very first member of a struct can be 
cast directly into the first member. One caveat is when accessing the
Animal directly, you need to either cast it to Being, or call the base member.
You can't call the base members directly from animal, like you can in C++ or
Java. Another drawback is if a struct is declared on the stack or globally,
you can only cast to base class with a pointer.
```c
Animal* animal;
// ...
// Pretend animal is a valid, populated Animal.
// This is valid in C.
Being* b = (Being*)animal;
// You can access Being->x with animal->base->x, or the casted b->x
```

## Interface inheritance in C

In order to fully satisfy interfaces, three things are required.

### Create the struct for the interface

```c
struct Helloable{
  void (*SayHello)(void);
  void (*SayGoodbye)(struct Helloable const **helloable, char *name);
};
```

### Put the interface you want to implement as a struct member

```c
typedef struct
{
  Animal base;
  int barks_per_minute;
  Helloable *helloable;
} Dog;
```

### After declaring the functions (or here, implementing them) create a vtable unique for that struct

```c
void Dog_PrintStats(Dog *dog);
void Dog_SayHello(void);
void Dog_SayGoodbye(Helloable **helloable, char *name);
Helloable DogHelloableVtable = { Dog_SayHello, Dog_SayGoodbye };
```

### Optionally, use the constructor pattern to for creation functions

```c
Dog *Dog_Create()
{
  Dog *dog = malloc(sizeof(Dog));
  dog->helloable = &(DogHelloableVtable);
  return dog;
}
```

### Have a way to access a the struct implementing an interface struct

The interface pointer needs to be passed into the function when called, but 
how can we access members outside of the interface struct?
A naive way to do this is to have a pointer at the top of the interface struct
for the dervi pointer, but that causes several issues. The first issue is struct size.
If every vtable needs to contain a pointer, then every vtable needs to be copied into
the struct instead of having a global vtable, increasing size.

However, using the offsetof keyword defined in stddef.h, we can cast to and from the
base type simply given. This works well because each struct type can have its own unique
implementation, so we know exactly what we are casting to and from. You can use these macros
as a template for casting to and from the interface.

```c
#define ToHelloable(casting) &(casting->helloable)
#define FromHelloable(type, helloable) \
  ((type*)((char*)helloable - offsetof(type, helloable)))
```

We can access Dog and all of its properties, or Being and all of its properties using FromHellable.

```c
void Dog_SayGoodbye(Helloable **helloable, char *name)
{
  Being *self = (Being*)FromHelloable(Dog, helloable);
  printf("Woof-woof, from %s to %s\n", self->name, name);
}
```

While you can just get the helloable by accessing member `thing->helloable`,
I wrote a ToHelloable macro to complement the FromHelloablemacro. Here, it's used
to cast `dog`, `cat` and `person` to helloable.

```c
  my_helloable_array[0] = ToHelloable(dog);
  my_helloable_array[1] = ToHelloable(cat);
  my_helloable_array[2] = ToHelloable(person);
```

## Collections

I demostrated it working by having a collection of helloables. When calling
`SayHello` and `SayGoodbye`, the caller knows nothing about the implementation,
but the functions are unique and successfully access members of `Dog`, `Cat`, and `Person`.

```c
  for (i = 0; i < 3; i++)
  {
    Helloable **helloable = my_helloable_array[i];
    (*helloable)->SayHello();
    (*helloable)->SayGoodbye(helloable, "Jack");
  }
```

## Drawbacks and things to consider

### Performance

On modern machines, having everything coded to an interface is cheap.
But on legacy machines and embedded hardware, it's not so much. Having 
to dereference so many function pointers is not exactly ideal when you
need to squeeze every last bit of performance.

### Syntax and macros

If a base struct implements an interface and a derived struct doesn't, due to
how the offsetof macro works, you need to cast the struct to the base interface
or pass the base member. If both a base struct and a derived struct implement an
interface differently, you should not cast to the base struct as it will use
the base struct implementation instead of the derived struct implementation.

### Refactoring and abstraction

While it might be nice to know explicitly which function is virtual or not due to
the syntax of calling a function pointer versus a normal function, the abstraction
between the two are gone. If you decide to make the void function `Cat_PrintStats` an interface,
then you'll probably need to change every call to `Cat_PrintStats` to accommodate
this change. Also, by having pointers to vtables containing pointers to functions,
if called explicitly, it is painfully obvious which function is called via interface
and which function is not. The same issues arise if you want to go from an interface
to a normal function.

### Memory management

Depending on your memory management patterns, inheritance could cause some confusion
if you lose your reference to the base class. If you free a pointer to an interface,
you will likely crash your program or cause memory corruption. Memory management can
be made easier using this using the destructor pattern by putting a destructor in an
interface or base struct.

## More

I wrote some more notes in the actual gists for the struct. Check out [Complete gist for helloable.c](https://gist.github.com/xianbaum/463f13a8d39014131b3f4fa67a241119) and [the C++ equivalent gist, helloable.cpp](https://gist.github.com/xianbaum/1407f6a63ed826e4f42e7100c38977e9).

I wrote a lot about the implementation years after I actually implemented it.
I might re-visit the implementation more with fresh eyes and change it a little bit.
I don't want to mislead people, so if I made a mistake writing, please contact me.
