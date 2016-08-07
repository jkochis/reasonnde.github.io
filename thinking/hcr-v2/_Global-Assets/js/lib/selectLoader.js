define(['module', 'lib/ie'], function (module, ie) {
    return {
        load: function (id, require, load, config) {
            var select = module.config().selectLoader || (ie < 9 ? 'DummySelect' : 'ActualSelect');
            require([select], load);
        }
    };
});