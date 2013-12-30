##ThView.js - JavaScript Spherical Image Viewer

##Description
ThView.js is a JavaScript image viewer program which shows spherical image photograph like [RICOH THETA](https://theta360.com/en/).

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


##Option
| keyword |   description   |  range |  default |
|:----------:|:------------------|:--------:|:---------:|
|  id  |  ID of parent div element (required)|  -   |  -  |
| file  | image file name (required)| - | -  |
| width  | width of view area | number | 500  |
| height  | height of view area | number | 300  |
| rotation  | start rotation on page load | true/false | false  |
| speed    | rotation speed | -100..100 | 10 |
| zoom    | zoom up image | 10..500 | 70 |
| firstview | degree of initial image | 0..360 | 0 |
| degree | array of axis angle [x, y, z]| [0..360,0..360,0..360] | [0,0,0] |

##Demo Page
http://aikelab.net/thview/

##NOTE
 - ThView.js requires web server. It does not work from local file.
 - The image file must be located on same origin.

##Credit
ThView.js is licenced under MIT License. Copyright 2013, aike (@aike1000)
