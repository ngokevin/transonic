define('settings', ['l10n', 'settings_local', 'underscore'], function(l10n, settings_local, _) {
    var gettext = l10n.gettext;

    return _.defaults(settings_local, {
        app_name: 'transonic',
        init_module: 'main',
        default_locale: 'en-US',
        api_url: 'http://' + window.location.hostname,  // No trailing slash, please.

        storage_version: '0',

        param_whitelist: ['q', 'sort'],
        api_param_blacklist: null,

        // Used for feed builder.
        model_prototypes: {
            'feed-app': 'slug',
            'feed-brand': 'slug',
            'feed-collection': 'slug',
            'feed-shelf': 'slug',
        },

        fragment_error_template: 'errors/fragment.html',
        pagination_error_template: 'errors/pagination.html',

        tracking_id: 'UA-36116321-6',

        persona_unverified_issuer: 'login.persona.org',

        // A data URI of the project logo (shown when logging in via Persona).
        persona_site_logo: 'data:image/png;base64,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',

        // The URLs for the Persona ToS and Privacy Policy.
        persona_tos: null,
        persona_privacy: null,

        title_suffix: 'Firefox Marketplace Curation Tools',

        languages: [
            'bn-BD', 'ca', 'cs', 'de', 'el', 'en-US', 'es', 'fr', 'hr', 'hu',
            'it', 'mk', 'nl', 'pl', 'pt-BR', 'ro', 'ru', 'sr', 'sr-Latn', 'sk',
            'tr', 'zh-CN'
        ],

        // A list of regions and their L10n mappings.
        REGION_CHOICES_SLUG: {
            'restofworld': gettext('Rest of World'),
            'ar': gettext('Argentina'),
            'br': gettext('Brazil'),
            'cl': gettext('Chile'),
            'cn': gettext('China'),
            'co': gettext('Colombia'),
            'de': gettext('Germany'),
            'gr': gettext('Greece'),
            'hu': gettext('Hungary'),
            'it': gettext('Italy'),
            'mx': gettext('Mexico'),
            'me': gettext('Montenegro'),
            'pe': gettext('Peru'),
            'pl': gettext('Poland'),
            'rs': gettext('Serbia'),
            'es': gettext('Spain'),
            'uk': gettext('United Kingdom'),
            'us': gettext('United States'),
            'uy': gettext('Uruguay'),
            've': gettext('Venezuela'),
        },

        carriers: [
            'america_movil',
            'china_unicom',
            'deutsche_telekom',
            'etisalat',
            'hutchinson_three_group',
            'kddi',
            'kt',
            'megafon',
            'qtel',
            'singtel',
            'smart',
            'sprint',
            'telecom_italia_group',
            'telefonica',
            'telenor',
            'tmn',
            'vimpelcom'
        ],

        bg_color_choices: [
            '#B90000',  // Raring Red.
            '#FF4E00',  // Oneric Orange.
            '#CD6723',  // Breezy Brown.
            '#00AACC',  // Dapper Blue.
            '#5F9B0A',  // Gusty Green.
            '#2C393B',  // Intrepid Indigo.
        ],

        text_color_choices: [  // Defecated.
            '#000000',  // Pretty Dark.
            '#FFFFFF',  // A bit brighter than Pretty Dark.
        ],
    });
});
