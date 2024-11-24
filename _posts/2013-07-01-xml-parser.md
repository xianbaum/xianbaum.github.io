---
layout: post
title: XML Parser
permalink: /blog/2013-07-01-xml-parser
date: 2013-07-01 22:55:00 -0700
---

Today, I finished the majority of the code for the XML parser. Previously, the enemies and levels had to be hard-coded within Java, and making them could be tedious. I felt like that solution was a little too messy, since my files were seriously getting to be a couple thousand lines of code after programming a couple enemies. I still have to translate this code to XML and get some kinks out and debug (not exactly as easy as it sounds, however…), but this looks like a promising future for my game and should make development that much faster!

Here is an example of what it looked like before:

``` java
this.texture[8] = SVGBitmapTextureAtlasTextureRegionFactory.createFromAsset(this.mBuildableBitmapTextureAtlas, this, “monster-head.svg”, 256,256);
this.texture[9] = SVGBitmapTextureAtlasTextureRegionFactory.createFromAsset(this.mBuildableBitmapTextureAtlas, this, “monster-body.svg”, 256, 512);
this.texture[10] = SVGBitmapTextureAtlasTextureRegionFactory.createFromAsset(this.mBuildableBitmapTextureAtlas, this, “monster-arms.svg”, 256, 512);
```

(later in the code)

``` java
enemy[8] = new Actor();
enemy[8].limb[1].Y=-4;
enemy[8].limb[0] = new Limb();
enemy[8].limb[0].Sprite = new Sprite(300*(cameraWidth/854),200*(cameraHeight/480), texture[8]);
enemy[8].limb[0].width = 100*(cameraWidth/854);
enemy[8].limb[0].height = 100*(cameraWidth/854);
enemy[8].limb[0].Y=-25;
enemy[8].limb[1] = new Limb();
enemy[8].limb[1].Sprite = new Sprite(300*(cameraWidth/854),200*(cameraHeight/480), texture[10]);
enemy[8].limb[1].width = 450*(cameraWidth/854);
enemy[8].limb[1].height = 400*(cameraWidth/854);
enemy[8].limb[2] = new Limb();
enemy[8].limb[2].Sprite = new Sprite(300*(cameraWidth/854),200*(cameraHeight/480), texture[9]);
enemy[8].limb[2].width = 400*(cameraWidth/854);
enemy[8].limb[2].height = 400*(cameraWidth/854);
enemy[8].X = 100;
enemy[8].Y = 99;
enemy[8].Z = 0;
enemy[8].health = 1000;
```

Now, both segments of the code can be contained in one file. Here’s an example of what it may look like now, and in a separate file rather in the same file as hundreds of other enemies of different types.

``` xml
<enemy limbcount = “2” name = “monster”>
    <health>1000</health>
    <position x=“100” y=“99” z=“0” />
    <limb id=“0” name = “monster-head”
    <img width=“100” height=“100”>monster-head.svg</img>
    <options y=“-25” />
    </limb>
    <limb id=“1” name = “monster-body”>
    <img width=“400” height=“400”>monster-body.svg</img>
    </limb>
    <limb id=“2” name = “monster-arms”>
    <img width=“450” height=“400”>monster-arms.svg</img>
    <options y=“-4” />
    </limb>
</enemy>
```

As you can tell, it’s much cleaner. In future, I want to make a small program that generates this XML code for me to make development even easier.

*Note added November 24, 2024: This is in reference to Punching Out Cthulhu.*
