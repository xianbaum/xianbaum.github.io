---
layout: post
title:  "Lua implementation: Day 3"
date: 2018-05-17 02:40:00 -0700
categories: citynight
---

<!-- blank line -->
<figure class="video_container">
  <video controls="true" allowfullscreen="true">
    <source src="/videos/2018-05-17 02-08-52.webm" type="video/webm">
  </video>
</figure>
<!-- blank line -->

The lua console is essentially complete. At this point, it should be very easy to add anything I may need to it. I don't need anything specific right away, so I plan on adding features as I need them and be done with the console.  There is a tiny bug with the console buffer printing old strings that I may or may not fix - it's visible in the video above. I get a warm feeling just playing with it, seeing characters pop-up and be removed dynamically. Is that weird? :)

Are you programming a game in a C compatible language and interested in integrating Lua in your game? Do it! [The documentation is in-depth](https://www.lua.org/manual/) and there is a great community at [lua-users.org](https://lua-users.org) It is easy to use. For me, the most helpful sections of the documentation was that of [usertypes](https://www.lua.org/pil/28.1.html), and peaking at an [example of usertypes in action](http://lua-users.org/wiki/UserDataExample).
