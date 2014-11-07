require(["jquery", "js/views/xblock_validation", "js/models/xblock_validation"],
function ($, XBlockValidationView, XBlockValidationModel) {
    'use strict';
    return function (validationMessages, xblock_url, is_root) {
       // % if xblock_url and not is_root:
       // validationMessages.showSummaryOnly = true;
        var model = new XBlockValidationModel(validationMessages, {parse: true});

        if (!model.get("empty")) {
            var validationEle = $('div.xblock-validation-messages[data-locator="${xblock.location | h}"]');
            var viewOptions = {
                el: validationEle,
                model: model
            };
            //% if is_root:
          //  viewOptions.root = true;

            var view = new XBlockValidationView(viewOptions);
            view.render();
        }
    };
});
