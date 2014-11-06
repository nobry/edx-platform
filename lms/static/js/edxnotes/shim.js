;(function (define, $, _, undefined) {
    'use strict';
    define(['annotator'], function (Annotator) {
        var _t = Annotator._t, proto;

        /**
         * Modifies Annotator.highlightRange to add a "tabindex=0" attribute
         * to the <span class="annotator-hl"> markup that encloses the note.
         * These are then focusable via the TAB key.
         **/
        Annotator.prototype.highlightRange = _.compose(
            function (results) {
                $('.annotator-hl', this.wrapper).attr('tabindex', 0);
                return results;
            },
            Annotator.prototype.highlightRange
        );

        /**
         * Modifies Annotator.Viewer.html.item template to add an i18n for the
         * buttons.
         **/
        Annotator.Viewer.prototype.html.item = [
            '<li class="annotator-annotation annotator-item">',
              '<span class="annotator-controls">',
                '<a href="#" title="', _t('View as webpage'), '" class="annotator-link">',
                    _t('View as webpage'),
                '</a>',
                '<button title="', _t('Edit'), '" class="annotator-edit">',
                    _t('Edit'),
                '</button>',
                '<button title="', _t('Delete'), '" class="annotator-delete">',
                    _t('Delete'),
                '</button>',
              '</span>',
            '</li>'
        ].join('');

        // Click is an extra event, mouseout is modified
        proto = Annotator.prototype;
        _.extend(proto.events, {
            '.annotator-hl click': 'onHighlightClick',
            '.annotator-hl mouseout': 'onHighlightMouseout'
        });

        proto.mouseoutEnabled = true;
        proto.target = null;

        proto.onHighlightClick = function(event) {
            var _this = this;
            // First click or repeated click on same highlighted text
            if (proto.target === null || event.target === proto.target) {
                if (this.mouseoutEnabled) {
                    // Add a click event listener to document to re-enable
                    // mouseon if click happens outside of highlighted text.
                    // It removes itself after being called once.
                    $(document).on('click.edxnotes', function() {
                        _this.mouseoutEnabled = true;
                        $(this).off('click.edxnotes');
                        $(event.target).blur();
                    });
                }
                else {
                    $(document).off('click.edxnotes');
                    $(event.target).blur();
                }
                this.mouseoutEnabled = !this.mouseoutEnabled;
            }
            // First click on different highlighted text
            else {
                // We have to define exactly what behavior has to be implemented
                // here. For the moment, it behaves the same as a mouse click on
                // any part of the document: remove focus and (hide all notes
                // --> hiding is not yet implemented).
                $(event.target).blur();
                proto.target.trigger('mouseout');
            }

            proto.target = event.target;
            event.stopPropagation();
            event.preventDefault();
        };

        proto.onHighlightMouseout = function() {
            if (this.mouseoutEnabled) {
              this.startViewerHideTimer();
            }
        };
    });
}).call(this, define || RequireJS.define, jQuery, _);
