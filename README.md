## ng-bootstrap-grid
This project provide a Grid (Table) controller for angularJs. The style will use the bootstrap. The function will include Selection Grid and Category Grid.


###Installation
Installation is easy as ng-bootstrap-grid has minimal dependencies - only the AngularJS, Twitter Bootstrap's CSS and lodash are required.

####Install with Bower
```html
bowser install ng-bootstrap-grid --save
```


###Adding dependency to your project
When you are done downloading all the dependencies and project files the only remaining part is to add dependencies on the ng-bootstrap-grid AngularJS module:
```html
angular.module('myApp', ['ng-bootstrap-grid']);
```
When you're done, your setup should look similar to the following:
```html
<!doctype html>
<html ng-app="myApp">
<head>
    <script src="js/angular/angular.js"></script>
    <script src="js/lodash/lodash.js"></script>
    <script src="js/ng-bootstrap-grid/dist/ng-bootstrap-grid.js"></script>
    <link rel="stylesheet" href="../lib/bootstrap/dist/css/bootstrap.css">
</head>
<body>
<script type="text/javascript">
    var myApp = angular.module('myApp', ['ng-bootstrap-grid']);
</script>
</body>
</html>
```


###Supported browsers
Directives from this repository are automatically tested with the following browsers:
- Chrome (stable and canary channel)
- Firefox
- IE 9 and 10
- Opera
- Safari

Modern mobile browsers should work without problems.
