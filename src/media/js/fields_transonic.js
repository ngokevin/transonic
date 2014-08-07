define('fields_transonic',
    ['app_selector', 'apps_widget', 'aviary', 'feed', 'jquery', 'jquery.fakefilefield', 'log', 'nunjucks', 'preview_tray', 'requests', 'underscore', 'urls', 'utils', 'utils_local', 'validate_transonic', 'z'],
    function(app_select, apps_widget, aviary, feed, $, fakefilefield, log, nunjucks, preview_tray, requests, _, urls, utils, utils_local, validator, z) {
    'use strict';

    var imageUploads = {};  // keep track of drag-and-drop uploads to stuff into FormData later.
    var notify = require('notification').notification;
    var isEmptySlug = true;

    z.page.on('keypress', 'form', function(e) {
        if (e.keyCode == 13) {
            return false;
        }
    })
    .on('change', '.colors input', function() {
        // Sync color previews and inputs.
        var $parent = $(this).closest('.colors');
        var $labels = $parent.find('label');
        console.log()
        $labels.filter('.selected').removeClass('selected');
        var newSelected = $labels.filter('[for=' + this.id + ']').addClass('selected');
        console.log(newSelected);
    })
    .on('change', '.pq-rating input', function() {
        // Set rating data attribute to highlight stars.
        var $this = $(this);
        var $parent = $(this).closest('.pq-rating');
        var rating = $parent.find('input:checked').val();
        $parent.find('.choices').attr('data-rating', rating);
    })
    .on('change input', '.featured-type-choices', function(e) {
        // Tab between different featured types (graphic, desc, pull quote).
        $('.featured-details').hide().filter('.' + this.options[this.selectedIndex].getAttribute('data-type')).show();
        conditionally_required();
        utils_local.initCharCounter();
        utils_local.clear_errors();
    })
    .on('change', '.collection-type-choices', function(e) {
        // To help CSS toggle background image upload widgets for different collection types.
        $('.collection-type').hide().filter('.' + this.value).show();
        $(this).closest('form').attr('data-collection-type', this.value);
        utils_local.clear_errors();

        // Hide or show app groups when switching between tabs.
        if (this.value == feed.COLL_PROMO) {
            $('.result.app-group:not(.hidden)').show();
        } else {
            $('.result.app-group').hide();
        }
    })
    .on('app-selected', function(e, app) {
        if ($('.transonic-form').data('type') == 'apps') {
            apps_widget.set(app);
            $('.screenshots').html(nunjucks.env.render('preview_tray.html', {app: app}));
            z.page.trigger('populatetray');
        } else {
            apps_widget.append(app);
        }
    })
    .on('click', '.preview-tray li', utils._pd(function() {
        // Preview tray, select screenshot.
        var $this = $(this);

        // Move image to middle, activate the dot.
        $this.closest('.preview-tray').find('.dot').eq($this.index()).trigger('click')

        // Set the input value to the src.
        .closest('.screenshot').find('input').val($this.data('id'));
    }))
    .on('click', '.add-app-group', utils._pd(function() {
        /* Add app groups (somewhat like mega-collections) to widget. */
        apps_widget.add_group();
    }))

    // Drag and drop image uploads.
    .on('dragover dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
    })
    .on('drop', '.background-image-input', utils._pd(function(e) {
        var $this = $(this);

        // Read file.
        var file = e.originalEvent.dataTransfer.files[0];

        // Preview file.
        if (['image/png', 'image/jpeg'].indexOf(file.type) !== -1) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $this.addClass('filled')
                     .find('.preview').attr('src', e.target.result);
                $this.find('input[type="text"]').attr('value', file.name);
            };
            reader.readAsDataURL(file);
            imageUploads[$this.find('[type="file"]').attr('name')] = file;
        }
    }))

    // Click image uploads.
    .on('loaded', function() {
        $('.fileinput').fakeFileField();
    })
    .on('change', '.background-image-input [type="file"]', function() {
       var file = this.files[0];
       var preview = $(this).closest('.background-image-input').find('.preview');
       var reader = new FileReader();

       reader.onloadend = function() {
           preview.attr('src', reader.result);
           z.page.trigger('refresh_preview');
       };
       if (file) {
           reader.readAsDataURL(file);
       }
       $(this).closest('.background-image-input').addClass('filled');
    })

    .on('paste', 'input, textarea', function(e) {
        var max = this.getAttribute("maxlength");
        if (max) {
            e.clipboardData.getData('text/plain').slice(0, max);
        }
    })

    // Localization of text fields.
    .on('change', '#locale-switcher', function() {
        var lang = this.value;
        $('.localized').addClass('hidden')
                       .filter('[data-lang=' + lang + ']').removeClass('hidden');
        utils_local.initCharCounter();
    })

    // Events for slug prefills for every feed item type.
    .on('input change', '.name .localized', function() {
        highlight_localized();

        if (isEmptySlug) {
            $('#slug').val(utils_local.slugify($(this).val()));
        }
    })
    .on('blur', '.name .localized', function() { // Stop prefilling slug once we defocus 'name'.
        if ($('#slug').val().length) {
            isEmptySlug = false;
        }
    })
    .on('change', '#brand-type', function() {
        $('#slug').val(utils_local.slugify($(this).val()));
    })
    .on('change', '.realfileinput', function() {
        var $this = $(this);
        var errs = validator.image($this);
        if (errs.length) {
            notify({message: errs[0]});
            $this.val('');
        }
    });

    function conditionally_required() {
        /*
        To conditionally require a field based on the value of .featured-type-choices, add the
        data-required-types="" attribute to the field's label, setting it to a space-separated list
        of the values of .featured-type-choices for which it should be required, e.g.

        <label data-required-types="description quote">
        */
        $('[data-required-types]').removeClass('required');
        $('[data-required-types*=' + $('.featured-type-choices').val() + ']').addClass('required');
    }

    // Highlight languages that have been localized.
    function highlight_localized() {
        var localized = $('.localized');
        $('#locale-switcher option').each(function(i, option) {
            var lang = option.value;

            var vals = $.map(localized.filter('[data-lang=' + lang + ']'), function(field) {
                return field.value;
            });
            if (_.any(vals, function(val) { return val; })) {
                option.classList.add('highlighted');
            } else {
                option.classList.remove('highlighted');
            }
        });
    };

    return {
        highlight_localized: highlight_localized,
        conditionally_required: conditionally_required
    }
});
