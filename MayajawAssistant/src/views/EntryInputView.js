EntryInputView = Backbone.View.extend({
    initialize: function () {
        this.offeringsList = null
        this.marketOpsList = null
        this.render();
    },
    render: function () {
        var source = $("#entry-input-tmpl").html();
        var template = Handlebars.compile(source);
        var data = {};
        this.$el.html(template(data));
    },
    events: {
        "click #process-cenote-input": "parseCenoteInput",
        "click #process-market-input": "parseMarketInput",
        "click #cenote-input-text": "clearInputTextArea",
        "click #market-input-text": "clearInputTextArea"

    },
    parseCenoteInput: function (event) {
        var rawText = $("#cenote-input-text").val()
        this.offeringsList = ParseUtils.parseCenoteInput(rawText)
    },
    parseMarketInput: function (event) {
        var rawText = $("#market-input-text").val()
        this.marketOpsList = ParseUtils.parseMarketInput(rawText)
    },
    clearInputTextArea: function (event) {
        var promptStart = "-== Copiez"
        if (event.target.value.substring(0, promptStart.length) === promptStart) {
            event.target.value = ""
        }

    }

});
