casper.test.begin('basic test', function(test) {
    helpers.startCasper('/curate');

    helpers.waitForPageLoaded(function() {
        test.assertVisible('#create-landing');
    });

    helpers.done(test);
});
