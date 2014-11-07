define(["jquery", "js/views/xblock_validation", "js/models/xblock_validation"],
function ($, XBlockValidationView, XBlockValidationModel) {
    'use strict';
    return function (validationMessages, xblock_location, xblock_url, is_root) {
        if (xblock_url && !is_root) {
            validationMessages.showSummaryOnly = true;
        }

        var model = new XBlockValidationModel(validationMessages, {parse: true});

        if (!model.get("empty")) {
            var validationEle = $('div.xblock-validation-messages[data-locator="' + xblock_location + '"]');
            var viewOptions = {el: validationEle, model: model, root: is_root};

            if (is_root) {
                viewOptions.root = true;
            }

            new XBlockValidationView(viewOptions).render();
        }
    };
});
