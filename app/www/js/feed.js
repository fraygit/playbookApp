var oWebViewInterface = window.nsWebViewInterface;

function ReadMore() {
    $("#pnlStoryCont").slideDown('slow');
    $("#pnlStrands").slideDown('slow');
    $("#lnkReadMore").hide();
    $("#pnlSummary").hide();
    $("#pnlStory").show();
}

function Refresh() {
    
}

PullToRefresh.init({
    mainElement: 'body',
    onRefresh: function () {
        oWebViewInterface.emit("Refresh", '');
    }
});

$(document).ready(function () {

    var Summary = function (storyText) {
        if (storyText.length > 100) {
            storyText = storyText.substring(0, 100) + '...';
        }
        return storyText;
    };

    var FormatDate = function (datePosted) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var date = new Date(datePosted);
        return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }

    oWebViewInterface.on('LoadFeed', function (eventData) {

        var model = JSON.parse(eventData);
        var template = $('#template').html();

        var stories = [];
        $.each(model, function (storyIndex, storyItem) {
            var story = storyItem;

            story.DatePostedFormatted = FormatDate(story.DatePosted);

            story.StoryText = $(story.Content).text();
            story.StoryTextCut = Summary($(story.Content).text());
            story.RecognisingText = $(story.Recognising).text()
            story.RespondingText = $(story.Responding).text()

            var strands = [];
            if (story.Strand1) {
                strands.push({ Strand: 'Mana atua (Well-being)' })
            }
            if (story.Strand2) {
                strands.push({ Strand: 'Mana whenua (Belonging)' })
            }
            if (story.Strand3) {
                strands.push({ Strand: 'Mana tangata (Contribution)' })
            }
            if (story.Strand4) {
                strands.push({ Strand: 'Mana reo (Communication)' })
            }
            if (story.Strand5) {
                strands.push({ Strand: 'Mana auturoa (Exploration)' })
            }
            story.Strands = strands;
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
