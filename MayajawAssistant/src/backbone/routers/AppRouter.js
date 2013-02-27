var AppRouter = Backbone.Router.extend({
    entryInputView: null,
    cenoteOfferingsList: null,
    marketOpsList: null,
    cenoteInputText: null,
    marketInputText: null,

    routes: {
        "cenote": "cenote",
        "market": "market",
        "*actions": "defaultRoute" // matches anything else.
    },

    cenote: function (actions) {
        if (this.entryInputView == null) {
            this.defaultRoute(actions)
            this.navigate("")
            return
        }

        this.cenoteOfferingsList = this.entryInputView.offeringsList
        this.cenoteInputText = $("#cenote-input-text").val()
        var cenoteAnalysisView = new CenoteAnalysisView({el: $("#main")})
        cenoteAnalysisView.setOfferingsList(this.cenoteOfferingsList)
    },

    market: function (actions) {
        if (this.entryInputView == null) {
            this.defaultRoute(actions)
            this.navigate("")
            return
        }

        this.marketOpsList = this.entryInputView.marketOpsList
        this.marketInputText = $("#market-input-text").val()
        var marketAnalysisView = new MarketAnalysisView({el: $("#main")})
        marketAnalysisView.setMarketOpsList(this.marketOpsList)
    },

    defaultRoute: function (actions) {
        this.entryInputView = new EntryInputView({el: $("#main")})
        if (this.cenoteInputText != null) {
            $("#cenote-input-text").val(this.cenoteInputText)
        }
        if (this.marketInputText != null) {
            $("#market-input-text").val(this.marketInputText)
        }
    }
})
