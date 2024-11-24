---
layout: post
title:  "The year of two thousand and seventeen"
date: 2018-01-12 04:18:20 -0700
categories: citynight
---

Is it too late in January to reflect upon 2017?

So, this is my first post on this blog, called "progress" for City Night, a game I am working on. The thing is, I didn't make nearly as much progress as I had hoped for in 2017. Actually, I haven't made as much progress as I had hoped for 2018, either. It's fine, but it makes me a little bit sad. I started this blog as a means of helping me document what I do for City Night. I called it "progress" because I want this blog to help me make progress on City Night. Previously, I had a tumblr blog at punchingoutcthulhu.tumblr.com which contains old posts for very old versions of City Night. I actually made a tumblr command line poster so that I would not have to go on the site to post, but it turns out, Jekyll is so much more convenient for writing posts like these. I may still write post on there just for the gamedev community on Tumblr, but I o they would be pretty condensed and for more in-depth updates, this would be the site to go to.

*(Note: Posts from the progress blog and tumblr blog mentioned above have been merged here.)*

## City Night

If you are interested in seeing what it is like so far, there is a demo from early last year I frantically threw together. [It can be acquired here, on itch.io](https://xianbaum.itch.io/city-night). There is also an older version on there. These demos are in no way complete (in fact I would hardly consider them playable) and I only made them because a group had a "demo day" and I tried to meet the deadline of it. I hope to put together more demos in the future!

![Screenshot of City Night](/images/2018-01-12-citynight-screenshot.png)

I started work on the first "dungeon" (that's what I call them) in City Night: the school. The location is mapped out completely, but not all of the tilesets exist yet. Most of them just use this basic red white and black tileset, but the layouts are essentially done.

![Screenshot of City Night showing the red white and black tileset](/images/2018-01-12-citynight-screenshot2.png)

I also began work on an essential part of City Night: items and enemies. The idea was to have people chase you, and in Home Alone fashion, you can only defend yourself with your resourcefulness and traps, but that is not implemented. In DD13 demo linked above, there's something really silly you can do that was me starting on this idea. In the menu, you can use the light on the paper that you have and you can light it on fire. It does absolutely nothing except that a fireball follows you on your side. It looks absolutely silly and I love it.

On the technical side, I made many things for City Night:

1. Logger
2. Asset resolver
3. Memory leak detector
4. A method for using interfaces in C
5. Type-safe generics in C using macros to define them

I need to rewrite quite a bit of the code, specifically for characters and items, since the way it is currently programmed is less than ideal and a bit of a mess (but at the time, I thought my methods were the was the greatest). Basically, before, I had subroutines for each actor (an actor is what I call any interactable thing). You could add or remove a struct containing a function pointer and data. I called them subroutines but that's not exactly the right term. That was how I was going to differentiate every actor in the game. I ran into problems with this, specifically if I wanted to access data from a certain subroutine that may or may not have existed, and ran into problems with the order that they executed. Just to clarify, I am still going to do this for smaller things, like generic status effects! Just not for every actor, and I am not using it to differentiate one actor for another. That's why I looked into class-based and interface-based in C.

Fun-fact: While taking screenshots tonight, I encountered a game crash caused by a missing idle animation that was frustrating me I coudln't find out the root cause.

## City Night Tools

Late December of 2016, I made a crude, buggy, animation tool that assisted me in making animations. I made it in JavaScript. I started on a Javascript map editor, too, as I had been using Tiled before, but it was also very crude and buggy. I could have built on top of that, but the code was so ugly and unmaintainable. To help me learn Angular and TypeScript, I started writing my own tools for City Night - and I largely rewrote the sprite editor and map editor.

![Pictured is a screenshot of my map editor](/images/2018-01-12-mapeditor.jpg)

It's not complete yet, unfortunately. The map editor is close to being done, but I also want to port my animation editor and write a generic sequence scripter (thing dialog boxes, cutscene and flags). It's a little discouraging that I was unable to finish my tooling in a year. I haven't been consistently working on it, though. I don't think it is that the tools should take over a year to make. My goal is to finish them by the end of January. I am not sure if it is attainable, as I have two and a half weeks, but it is a challenge to aim for.

## Arthritis

Well last year, I developed an undifferentiated arthritis and that among other things made me feel kind of bummed. I fell into a rut and I would either have days where I thought "Well, I need to complete City Night before I die" and other days where I thought "It's hopeless". Arthritis is not that serious but chronic pain can discouraging be sometimes. I thought my life was over.

I started taking classes at an improv theater because I needed to meet friends and I needed to do something that would inspire me to have hope in life. I made a lot of friends and I think it was a lot of fun. All and all, my mental state has generally much improved from last year.

## Here's to progress!
