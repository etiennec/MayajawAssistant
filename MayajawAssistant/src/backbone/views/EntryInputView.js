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
        "click #market-input-text": "clearInputTextArea",
        "click #load-cenote-data": "loadCenoteData",
        "click #load-market-data": "loadMarketData"

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

    },
    loadCenoteData: function () {
        this.loadTextData("#cenote-input-text", "data/cenote.txt");
    },
    loadMarketData: function () {
        this.loadTextData("#market-input-text", "data/market.txt");
    },
    loadTextData: function (textAreaId, dataFilePath) {
        $.get(dataFilePath, null, function (data) {
            $(textAreaId).val(data);
        }, "text");
    }


});
