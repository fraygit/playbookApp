$(document).ready(function () {
    var oWebViewInterface = window.nsWebViewInterface;

    $('#txtStory').summernote({
        height: '300px',
        toolbar: []
    });
    $('#txtRecognising').summernote({
        height: '300px',
        toolbar: []
    });
    $('#txtResponding').summernote({
        height: '300px',
        toolbar: []
    });

    oWebViewInterface.on('RetrieveData', function (eventData) {

        var story = $($(".note-editable.panel-body")[0]).html();
        var recognising = $($(".note-editable.panel-body")[1]).html();
        var responding = $($(".note-editable.panel-body")[2]).html();

        var model = {
            Type: $("#ddType").val(),
            Title: $("#txtTitle").val(),
            Story: story != undefined ? story : '',
            Recognising: recognising != undefined ? recognising : '',
            Responding: responding != undefined ? responding : '',
            Strand1: $("#Strand1Goal1").prop('checked') || $("#Strand1Goal2").prop('checked') || $("#Strand1Goal3").prop('checked'),
            Strand1Goal1: $("#Strand1Goal1").prop('checked'),
            Strand1Goal2: $("#Strand1Goal2").prop('checked'),
            Strand1Goal3: $("#Strand1Goal3").prop('checked'),
            Strand2: $("#Strand2Goal1").prop('checked') || $("#Strand2Goal2").prop('checked') || $("#Strand2Goal3").prop('checked') || $("#Strand2Goal4").prop('checked'),
            Strand2Goal1: $("#Strand2Goal1").prop('checked'),
            Strand2Goal2: $("#Strand2Goal2").prop('checked'),
            Strand2Goal3: $("#Strand2Goal3").prop('checked'),
            Strand2Goal4: $("#Strand2Goal4").prop('checked'),
            Strand3: $("#Strand3Goal1").prop('checked') || $("#Strand3Goal2").prop('checked') || $("#Strand3Goal3").prop('checked'),
            Strand3Goal1: $("#Strand3Goal1").prop('checked'),
            Strand3Goal2: $("#Strand3Goal2").prop('checked'),
            Strand3Goal3: $("#Strand3Goal3").prop('checked'),
            Strand4: $("#Strand4Goal1").prop('checked') || $("#Strand4Goal2").prop('checked') || $("#Strand4Goal3").prop('checked') || $("#Strand4Goal4").prop('checked'),
            Strand4Goal1: $("#Strand4Goal1").prop('checked'),
            Strand4Goal2: $("#Strand4Goal2").prop('checked'),
            Strand4Goal3: $("#Strand4Goal3").prop('checked'),
            Strand4Goal4: $("#Strand4Goal4").prop('checked'),
            Strand5: $("#Strand5Goal1").prop('checked') || $("#Strand5Goal2").prop('checked') || $("#Strand5Goal3").prop('checked') || $("#Strand5Goal4").prop('checked'),
            Strand5Goal1: $("#Strand5Goal1").prop('checked'),
            Strand5Goal2: $("#Strand5Goal2").prop('checked'),
            Strand5Goal3: $("#Strand5Goal3").prop('checked'),
            Strand5Goal4: $("#Strand5Goal4").prop('checked'),
        };
        oWebViewInterface.emit("GetValues", JSON.stringify(model));
    });
});