# ionic-number-picker
A ionic number picker module

This module is forked from [angular-number-picker](https://github.com/leftstick/angular-number-picker)

I have just done some changes to remove the dependency on bootstrap, and add the following features:

1. In original version, number can only be revised by +/- button, in this version, it can also be revised directly thought input.
2. When the input lost focus, check if the number inputed is valid, if not, set it to a reasonable value. 


Most of the original function is reserved, except the 'singular', 'plural' and 'build-in class'. (I hard code the css because I am lazy. :) )

In addtion, this version is dependented on ionic, so change to name from angular-number-picker to ionic-number-picker.

check the original link for the usage: [angular-number-picker](https://github.com/leftstick/angular-number-picker)

[Demo](http://codepen.io/leonz/pen/yeVVWN)