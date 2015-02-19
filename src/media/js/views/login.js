define('views/login',
    ['core/l10n', 'core/user', 'core/urls', 'core/z'],
    function(l10n, user, urls, z) {

    var gettext = l10n.gettext;

    z.page.on('logged_in', function() {
        z.page.trigger('navigate', [urls.reverse('home')]);
    });

    return function(builder) {
        if (user.logged_in()) {
            z.page.trigger('navigate', [urls.reverse('home')]);
        } else {
            builder.start('login.html');
            builder.z('type', 'leaf login');
            builder.z('title', gettext('Sign in'));
        }
    };
});
