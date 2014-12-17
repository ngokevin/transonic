(function () {
    var assert = require('assert');
    var ok_ = assert.ok_;
    var mock = assert.mock;

    test('translated locales determined', function (done, fail) {
        var get_translated_locales = require('forms_transonic').get_translated_locales;
        var data = {
            'field1': {
                'lang1': '',
                'lang2': '',
                'lang3': 'Val'
            },
            'field2': {
                'lang1': '',
                'lang2': 'Val',
                'lang3': ''
            },
            'field3': 'Unrelated',
            'field4': {
                'this is': 'not translated'
            }
        };
        var locales = get_translated_locales(data, ['field1', 'field2']);
        ok_(locales.indexOf('lang1') === -1); 
        ok_(locales.indexOf('lang2') >= 0); 
        ok_(locales.indexOf('lang3') >= 0); 
        done();
    });

    test('empty translatons populated', function (done, fail) {
        var populate_empty_translations = require('forms_transonic').populate_empty_translations;
        var data = populate_empty_translations({
            'field1': {
                'lang1': 'Val'
            },
            'field2': {
                'lang2': 'Val'
            }
        }, ['field1', 'field2']);
        ok_('lang1' in data['field1']);
        ok_('lang2' in data['field1']);
        ok_('lang1' in data['field2']);
        ok_('lang2' in data['field2']);
        done();
    });

})();
