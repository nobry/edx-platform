define(['jquery', 'js/edxnotes/notes', 'jasmine-jquery'],
    function($, Notes) {
        'use strict';

        describe('Test Shim', function() {
            var annotator, highlight;

            // TODO: And error is thrown in annotator-full.min.js (line 21):
            // $(...).parents(...).addBack is not a function
            // The following tests work with a modified version of
            // annotator-full.js where the two addBack calls have been removed.
            beforeEach(function() {
                loadFixtures('js/fixtures/edxnotes/edxnotes.html');
                annotator = Notes.factory($('div#edx-notes-wrapper-123')[0], {});
                highlight = $('<span class="annotator-hl" />').appendTo(annotator.element);
                spyOn(annotator, 'onHighlightClick').andCallThrough();
                spyOn(annotator, 'onHighlightMouseover').andCallThrough();
                spyOn(annotator, 'startViewerHideTimer').andCallThrough();
            });

            it('Test that clicking a highlight freezes mouseover and mouseout', function() {
                expect(annotator.isFrozen).toBe(false);
                highlight.click();
                expect(annotator.onHighlightClick).toHaveBeenCalled();
                expect(annotator.onHighlightMouseover).toHaveBeenCalled();
                expect(annotator.isFrozen).toBe(true);
                annotator.onHighlightMouseover.reset();
                highlight.mouseout();
                expect(annotator.startViewerHideTimer).not.toHaveBeenCalled();
                highlight.mouseover();
                expect(annotator.onHighlightMouseover).not.toHaveBeenCalled();
            });

            it('Test that clicking twice reverts to default behavior', function() {
                highlight.click();
                $(document).click();
                annotator.onHighlightMouseover.reset();
                expect(annotator.isFrozen).toBe(false);
                highlight.mouseover();
                expect(annotator.onHighlightMouseover).toHaveBeenCalled();
                highlight.mouseout();
                expect(annotator.startViewerHideTimer).toHaveBeenCalled();
            });

            // TODO:
            // Check behavior with two highlights???
            // Check that two instances of Annotator work correctly on same
            // fixture???
        });
    }
);