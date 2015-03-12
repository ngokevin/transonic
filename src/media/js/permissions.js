define('permissions',
    ['core/urls', 'core/user', 'core/utils'],
    function(urls, user, utils) {

    var noAuthRequiredUrls = [
        urls.reverse('login'),
        urls.reverse('core/fxa_authorize'),
    ];

    return {
        allowed: function(url) {
            return !this.authenticationRequired(url) || user.logged_in();
        },
        authenticationRequired: function(url) {
            var baseUrl = utils.baseurl(url);
            return noAuthRequiredUrls.indexOf(baseUrl) === -1;
        },
    };
});
