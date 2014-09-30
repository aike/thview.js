##ThView.js - JavaScript Spherical Image Viewer

##Description
ThView.js is a JavaScript image viewer program which shows spherical image photograph like [RICOH THETA](https://theta360.com/en/).

##Demo Page
http://aikelab.net/thview/ 
http://aikelab.net/thview/hmd.html 
http://aikelab.net/thview/hmd2.html 

##Features
* direction control with mouse drag
* zooming with mouse wheel
* auto direction control according to acceleration sensor for mobile devices
* fixed intervals Camera animation
* dual screen mode for Head Mount Display

##How To Use
load script with [Three.js](http://threejs.org/)

    <script type="text/javascript" src="three.min.js"></script>
    <script type="text/javascript" src="thview.js"></script>

simple example

    <div id="ph1"></div>
    <script type="text/javascript" >
        var img1 = new ThView({id:'ph1', file:'photo.jpg'});
    </script>

with customize option

    <div id="ph2"></div>
    <script type="text/javascript" >
        var img2 = new ThView({
            id:'ph2',
            file:'photo2.jpg',
            firstview:180,
            zoom:100,
            width:300,
            height:200,
            rotation:true,
            speed:-30});
    </script>

interval camera animation

    <div id="ph3"></div>
    <script type="text/javascript" >
        var img3 = new ThView({
            id:'ph3',
            file:['photo1.jpg','photo2.jpg','photo3.jpg','photo4.jpg'],
            interval: 300
        });
    </script>

HMD mode example

    <div id="ph4"></div>
    <script type="text/javascript" >
        var img4 = new ThView({
            id:'ph4',
            file:'photo.jpg',
            width: 980,
            height: 560,
            hmd: true
        });
    </script>


##Option
| keyword |   description   |  range |  default |
|:----------:|:------------------|:--------:|:---------:|
|  id  |  ID of parent div element (required)|  -   |  -  |
| file  | image file name or array of image file names (required)| - | -  |
| width  | width of view area | number | 500  |
| height  | height of view area | number | 300  |
| rotation  | start rotation on page load | true/false | false  |
| speed    | rotation speed | -100..100 | 10 |
| zoom    | zoom up image | 20..130 | 70 |
| firstview | degree of initial image | 0..360 | 0 |
| interval | interval time(msec) of animation | number | 500 |
| hmd | dual screen for Head Mount Display | ture/false | false |
| degree | array of axis angle [x, y, z]| [0..360,0..360,0..360] | [0,0,0] |

##NOTE
 - ThView.js requires web server. It does not work from local file.
 - The image file must be located at same origin.
 - The pixel size must be power of 2

##Credit
ThView.js is licenced under MIT License. Copyright 2014, aike (@aike1000)
