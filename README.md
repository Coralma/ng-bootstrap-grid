## ng-bootstrap-grid
This project provide a Grid (Table) controller for angularJs. The style will use the bootstrap. The function will include Selection Grid, Category Grid and Pagination Grid.


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
    <script src="js/ng-bootstrap-grid/dist/ng-bootstrap-category-grid.js"></script>
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

###Example
Please download and use `bower install` the project. Run and check the example case for usage.

###Need help?
Need help using ng-bootstrap-grid?

- Create new issues in this repository to ask questions about using ng-bootstrap-grid.
- Ask a question in StackOverflow under the ng-bootstrap-grid tag.
 

###Roadmap of ng-bootstrap-grid
- Support basic bootstrap grid (`DONE`)
- Support cell template for all kinds of bootstrap grid (`DONE`)
- Support selection bootstrap grid (`DONE`)
- Support category bootstrap grid (`DONE`)
- Support category bootstrap grid with selection (`DONE`)
- Support pagination bootstrap grid(`DONE`)
- Support pagination bootstrap grid with selection (`DONE`)
- Support sort function of bootstrap grid (`TODO`)
- Support sort function of bootstrap grid with pagination (`TODO`) 
- Support column hide and column customized definition by grid menu (`TODO`) 
- Support column moving of bootstrap grid (`TODO`) 
- Support footer of bootstrap grid (`TODO`) 
- Support multiple level header of bootstrap grid (`TODO`) 

###Thanks
Thanks ng-grid push me to make this decision create this project. The function of ng-grid is awesome but UI style and performance is far form what I expect.

Thanks Lodash and bootstrap, both of you are awesome technology and less my code.
