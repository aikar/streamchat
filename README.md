# Streamchat

[![Greenkeeper badge](https://badges.greenkeeper.io/aikar/streamchat.svg)](https://greenkeeper.io/)
Aikar's stream chat bridge.
I use NGINX RTMP module to split a single output Live Stream and relay it to many services:
[Stream Relay Config File](https://gist.github.com/aikar/937ae21ad9bc9600269cfbb4a1b1e96f)

This connects Twitch, HitBox, LiveCoding and Beam chat rooms, and bridges them into an IRC channel (#aikar on irc.spi.gt)


This lets me monitor all 4 streaming services chat at the same time in 1 window.

I then can respond to all services using IRC commands.

Finally, a log of all chat is rendered to TEXT and HTML, and an auto refreshing page is provided.

Then using the WebKit Embedded browser in OBS, this chat is able to be overlayed into the stream itself, so everyone
can follow along from other services.

## Code Hackyness & Using it yourself
This project has been a major quick hackjob. I know it has some hacky styles and abusing of globals. 
It's small. I don't care about the politics. It got the job done and saved me time trying to follow political rules.

While I've made effort to make every piece configurable, it is NOT usable off the shelf. If you want to use this, you'll
need to make some tweaks and fixes. Notably it blows up if streamchat.txt and streamchat.html is missing

And the sample config is out of date.

## License

The MIT License (MIT)

Copyright (c) 2016 Daniel Ennis <aikar@aikar.co>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
