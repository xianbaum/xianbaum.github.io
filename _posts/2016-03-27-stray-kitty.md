---
layout: post
title: Presenting Stray Kitty (a JavaScript cat toy)
permalink: /blog/2016-03-27-stray-kitty
date: 2016-03-27 00:54:58 -0700
---

Hi! I’m really excited to talk about this one because it’s something that I think everyone might like! Today and yesterday, I was working on a cat toy that I’ve been thinking about making for a while now. Anyway, I finished it!

Demo here *(link removed, dead link. Click on cat icon in the corner to try, though!)*

GitHub here <https://github.com/xianbaum/StrayKitty>

The cats act on their own, but you can interact with them by clicking on them.

I don’t know if anyone ever played around with a program called Stray Sheep in the late 90s/early 2000s, but this project is based on that. That program understands me.

Anyway, small problem for those who don’t have a way to host their own stuff: I haven’t figured out a permanent way to store and be able to hotlink the JS and the image (without violating some other website ToS), so anyone who uses it will have to figure that out that themselves. I’m not about to use my network for that, either…

I will continue to maintain this, so look out for updates and new features! Maybe I’ll add more things to do, and more things that the kitties can do!

**How to use:**

1. Download and host Stray Kitty somewhere accessible on the net
2. Include the script <script src=“straykitties.js”></script>
3. Somewhere in your code after the page is loaded (maybe as an onload event or in a button with an onclick event, or inside the javascript itself), make a call to the StrayKitty.addKitty() function. Ex <body onload=“StrayKitty.addKitty()”>
4. To remove a kitty, use the StrayKitty.remKitty() function.
