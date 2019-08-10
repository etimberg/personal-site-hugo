---
title: "About this Site"
date: 2019-08-09T22:33
tags: [hugo"]
---

Welcome to my personal site. I wrote the site using [Hugo](https://gohugo.io/), a static site generator written in Go. It's been a great introduction to the Go template language. Hosting is done via static files published to Github pages.

<br>
I tried to make the site depend on as little JavaScript as possible. The only necessary JS is used to trigger the mobile menu view. Everything else was written using pure CSS and media queries. I used Sass to compile the CSS. The [sass flex mixin](https://github.com/mastastealth/sass-flex-mixin) was particularly helpful for generating the flexbox styling used in the photo albums. 

<br>
I used [gulp-image-resize](https://www.npmjs.com/package/gulp-image-resize) in a gulp task to automatically generate thumbnails for images. This greatly improved page performance and kept the process relatively pain free. In the future, I will likely add automatic watermarking as well.
