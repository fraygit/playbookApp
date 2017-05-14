var oWebViewInterface = window.nsWebViewInterface;

$(document).ready(function () {


    oWebViewInterface.on('LoadFeed', function (eventData) {

        var model = JSON.parse(eventData);
        var template = $('#template').html();

        var stories = [];
        $.each(model, function (storyIndex, storyItem) {
            var story = storyItem;
            story.StoryText = $(story.Content).text();
            stories.push(story);
        });

        Mustache.parse(template);   // optional, speeds up future uses
        var rendered = Mustache.render(template, { Stories: stories });
        $('#pnlFeed').html(rendered);

        $.each(document.getElementsByClassName('lightbox'), function (lbIndex, lbItem) {
            lightGallery(lbItem);
        });
    });

});
