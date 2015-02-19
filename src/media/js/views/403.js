define('views/403',
    ['core/l10n', 'core/user', 'core/urls', 'core/z'],
    function(l10n, user, urls, z) {

    var gettext = l10n.gettext;

    return function(builder) {
        if (!user.logged_in()) {
            z.page.trigger('navigate', [urls.reverse('login')]);
        } else {
            builder.start('errors/403.html');
            builder.z('type', 'leaf login');
            builder.z('title', gettext('Permission Denied'));
        }
    };
});
