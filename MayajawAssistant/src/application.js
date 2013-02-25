(function ($) {
    $("#subtitle").append(MSUtils.getRandomQuote())
    var app = new AppRouter();
    Backbone.history.start();

    //$("#cenote-input-text").val($("#cenote-sample-tmpl").html())
    //$("#market-input-text").val($("#market-sample-tmpl").html())

})(jQuery);