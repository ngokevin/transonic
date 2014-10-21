(function() {

var root = '^/curate/';

// Please leave quotes around keys! They're needed for Space Heater.
var routes = window.routes = [
    {'pattern': '^/$', 'view_name': 'home'},
    {'pattern': root + 'login$', 'view_name': 'login'},
    {'pattern': root + '403$', 'view_name': '403'},
    {'pattern': root + '$', 'view_name': 'home'},
    {'pattern': root + 'create/([^/<>"\']+)$', 'view_name': 'create'},
    {'pattern': root + 'manage$', 'view_name': 'listing'},
    {'pattern': root + 'manage/([^/<>"\']+)/([^/<>"\']+)$', 'view_name': 'edit'},
    {'pattern': root + 'feed$', 'view_name': 'feed_builder'}
];

define('routes', [
    'views/403',
    'views/create',
    'views/edit',
    'views/feed_builder' ,
    'views/home',
    'views/home',
    'views/listing',
    'views/login'
], function() {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        var view = require('views/' + route.view_name);
        route.view = view;
    }
    return routes;
});
})();
