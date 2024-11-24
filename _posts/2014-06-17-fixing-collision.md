---
layout: post
title: Fixing collision (Recap of my day)
permalink: /blog/2014-06-17-fixing-collision
date: 2014-06-17 05:58:00 -0700
---

Honestly, my collision code is still a mess. It could still use some TLC. But hey: At least it works now. I apwnr the whole day working on collision. The initial problem was so dumb, I can’t believe i didn’t notice it sooner. The problem was, it would cycle through each tile until it found one that it collided with, push the player outside of the box, then break. And I understand why I did it that way. Because it worked, most of the time. But there were two cases where it didn’t work as shown below:

*Note: video missing*

One case is actually kind of difficult to notice. It’s in corner of the wall and the ground. If you notice, the player kind of jitters. I suggest comparing with the second video, if you don’t see it. Also, the video is blurry, so it’s hard to see anyway. And the second problem is more obvious, and much more of a problem. See, the way I was colliding with tiles worked when there was only one tile to collide with, but it didn’t work with multiple tiles, AKA corners. It would comepletely ignore the second collision because it would break out of the cycle. So, I simply removed the break statement.

But it wasn’t done after that. Oooh no. I understand why it wasn’t removed initially. Because when I fixed that, other things broke, too. I tried several things:

*Note: video missing*

Programming collision is actually fairly difficult. Well, it was for me. In fact, there’s still a bug in my code but I’m happy with the way it is now. If I want to have collision for the right side of the tile (the left side of the player), then I’m going to have to add to the collision. I’m gonna want to do that, because going backwards is going to be a part of some of the level design.

There are other changes I made since yesterday, too. Here is a brief list of them:

- When you hold down the jump button, (how I found the bug in the code that I have yet to find)
- I put smooth corners around the land, instead of the square, jagged corners
- When you jump, the state successfully changes to to JUMPING, instead of RUNNING. This means that the animation frame stands still when you’re jumping and the animation runs when you’re on the ground. (Check it out in the videos above!)

For your convenience, I’ve included a copy of the player collision code below:

``` java
        for (Rectangle tile : tiles) {
            if (this.rect.overlaps(tile)) {
                hasTouchedTile = true;
                boolean hasUpper = false;
                boolean hasLower = false;
                boolean hasLeft = false;
                boolean hasRight = false;

                
                for( HiddenTile hiddenTile : hiddenTiles )
                {
                    if( hiddenTile.x == tile.x && hiddenTile.y == tile. y && hiddenTile.isUpper)
                        hasUpper = true;
                    if( hiddenTile.x == tile.x && hiddenTile.y == tile. y && !hiddenTile.isUpper)
                        hasLower = true;
                }
                for( HiddenTile hiddenTileX : hiddenTilesX )
                {
                    if( hiddenTileX.x == tile.x && hiddenTileX.y == tile. y && !hiddenTileX.isUpper)
                        hasLeft = true;
                    if( hiddenTileX.x == tile.x && hiddenTileX.y == tile. y && hiddenTileX.isUpper)
                        hasRight = true;
                }
                //of the tile
                float left= Math.abs(tile.x - (this.rect.x+this.rect.width));
                float top = Math.abs(tile.y+tile.height - this.rect.y);
                float right = Math.abs(tile.x+tile.width - this.rect.x);
                float bottom= Math.abs(tile.y - (this.rect.y+this.rect.height));
                //colliding with top
                
                if( tile.contains(this.rect.x+this.rect.width,this.rect.y)  && !hasUpper )
                {
                    this.state = State.RUNNING;
                    if( left > top )
                    {
                        this.y = (tile.y + tile.height);
                        if(this.yVelocity<=0)
                        {
                            this.isOnGround=true;
                            this.yVelocity = 0;
                        }
                    }
                    else
                    {
                        isBeingPushed = true;
                    }
                }
                else if( tile.contains(this.rect.x+this.rect.width,this.rect.y+this.rect.height) && !hasLeft && !hasLower )
                {
                    if(left > bottom)
                    {
                        this.y = (tile.y -1);
                        //hit upwards
                        if(this.yVelocity>0)
                            this.yVelocity = 0;
                    }
                    else
                        isBeingPushed = true;
                }
                else if( tile.contains(this.rect.x,this.rect.y+this.rect.height)  && !hasLower )//bottom
                {
                    this.y = (tile.y -1);
                    //hit upwards
                    if(this.yVelocity>0)
                        this.yVelocity = 0;
                }
                else if( tile.contains(this.rect.x,this.rect.y) && !hasUpper )//top
                {
                    this.y = (tile.y + tile.height);
                    if(this.yVelocity<=0)
                    {
                        this.isOnGround=true;
                        this.yVelocity = 0;
                    }
                }
                else
                {
                    isBeingPushed = true;
                }
                if(isBeingPushed && !hasLeft && !hasBeenPushed )
                {
                    this.x=tile.x-tempScroll-0.90f;
                    this.x-=scrollSpeed*time;
                    hasBeenPushed= true;
                }            
            }
        }
        if(!hasTouchedTile)
            this.isOnGround=false;
```

*Note November 24 2024: This game was heavily edited and released as Kat's Dream. The source code is here: <https://github.com/xianbaum/katsdream>.*
