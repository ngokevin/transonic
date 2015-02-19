console.log('Firefox Marketplace Curation Tools');

define('main', ['init'], function() {
require([
    'core/helpers',  // Must come before mostly everything else.
    'helpers_local',
    // 'forms',  // Comment this if your app has no forms.
    'core/l10n',
    'core/log',
    'core/login',  // Comment this if your app does not have accounts.
    'core/navigation',
    'templates',
    'core/user',  // Comment this if your app does not have accounts.
    'core/z'
], function() {
    var console = require('core/log')('main');
    var urls = require('core/urls');
    var user = require('core/user');
    var z = require('core/z');

    console.log('Dependencies resolved, starting init');

    z.body.addClass('html-' + require('core/l10n').getDirection());

    z.page.one('loaded', function() {
        console.log('Hiding splash screen');
        $('#splash-overlay').addClass('hide');
        $('main').append(
            nunjucks.env.render('feed_aside.html'));
    });

    // Do some last minute template compilation.
    var nunjucks = require('templates');
    z.page.on('reload_chrome', function() {
        console.log('Reloading chrome');
        $('#site-header').html(
            nunjucks.env.render('header.html'));
        $('#site-footer').html(
            nunjucks.env.render('footer.html'));

        z.body.toggleClass('logged-in', require('core/user').logged_in());
        z.page.trigger('reloaded_chrome');
    }).trigger('reload_chrome');

    z.body.on('click', '.site-header .back', function(e) {
        e.preventDefault();
        console.log('← button pressed');
        require('core/navigation').back();
    }).on('click', 'aside', function() {
        $(this).toggleClass('active');
    });

    z.page.on('loaded logged_in', function() {
        if (user.logged_in() && !user.get_permission('curator') &&
            !user.get_permission('admin')) {
            z.page.trigger('navigate', [urls.reverse('403')]);
        }
    });

    z.page.on('logged_out', function() {
        z.page.trigger('navigate', [urls.reverse('login')]);
    });

    z.page.on('navigate', function(e, url) {
        if ([urls.reverse('login'), urls.reverse('core/fxa_authorize')].indexOf(url)) {
            return;
        }
        if (!user.logged_in()) {
            z.page.trigger('divert', [urls.reverse('login')]);
        }
    });

    z.page.on('click', '.loadmore', function() {
        var $btn = $(this).find('button');
        $btn.text(gettext('Loading...'));
        z.page.one('loaded_more', function() {
            $btn.text(gettext('More'));
        });
    });

    // Perform initial navigation.
    console.log('Triggering initial navigation');
    z.page.trigger('navigate', [window.location.pathname + window.location.search]);
    z.page.trigger('loaded');

    console.log('Initialization complete');
});
});
