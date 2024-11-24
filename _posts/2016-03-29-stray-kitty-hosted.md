---
layout: post
title: "Stray Kitty: Hosted, and available as a Userscript"
permalink: /blog/2016-03-29-stray-kitty
date: 2016-03-29 00:58:03 -0700
---

Hi! Today I spent a little bit of time making Stray Kitty more accessible to everybody. If you take a look at my blog theme, you can see the kitties in action!

Now, anybody can include the script in whatever page they want by following these steps:

Put this anywhere in your HTML (hosted by Google Drive, allowed by its ToS)

*Note: removed dead link.*

Include a kitty in your webpage by calling the StrayKitty.addKitty() function when the page is loaded:

``` html
    <script>window.addEventListener(“load”,function() {StrayKitty.addKitty();});</script>
```

You can add as as many kitties as you want! Here, I add 20 kitties.

``` html
    <script>window.addEventListener(“load”,function() {for(i =0;i < 20; i++){StrayKitty.addKitty();}});</script>
```

Here is an HTML button that adds a kitty every time it is pressed:

``` html
    <input type=“button” id = “kittybutton” value = “Add Kitty”/><script>document.getElementById(“kittybutton”).addEventListener(“click”, function(){StrayKitty.addKitty();});</script>
```

Finally, if you want  to remove a kitty, you can call the StrayKitty.remKitty() function. Here is a button that removes a kitty:

``` html
    <input type=“button” id = “remkittybutton” value = “Remove Kitty”/><script>document.getElementById(“remkittybutton”).addEventListener(“click”, function(){StrayKitty.remKitty();});</script>
```

It’s safe to call this function even when there are no kitties.

ALSO! If you have Greasemonkey installed, there are a couple of places you can get the user script, so you can bring the kitties wherever you browse to.

- From Greasy Fork: <https://greasyfork.org/en/scripts/18347-straykitty>
- From OpenUser: <https://openuserjs.org/scripts/xianbaum/StrayKitty>
- From GitHub Gists <https://gist.github.com/xianbaum/33f87efc2e095e1ebf7a>

Anyway, Stray Kitty is open source and its source code is hosted publicly on GitHub: https://github.com/xianbaum/StrayKitty
