CenoteAnalysisView = Backbone.View.extend({
    initialize: function () {
        this.offeringsList = null
        this.offererChartData = null
        this.offereeChartData = null
        this.render();
    },
    render: function () {
        if (this.offeringsList === null) {
            return
        }

        var viewTemplate = Handlebars.compile($("#cenote-analysis-tmpl").html())
        var offererItemTemplate = Handlebars.compile($("#offerer-list-item-tmpl").html())
        var offereeItemTemplate = Handlebars.compile($("#offeree-list-item-tmpl").html())
        this.offererChartData = this.offeringsList.getOfferersList(null)
        this.offereeChartData = this.offeringsList.getOffereesList(null)
        var offeringsListObject = this.offeringsList.toObject()
        this.$el.html(viewTemplate())
        $("#offerers-list-members").kendoListView({
            dataSource: {data: offeringsListObject.Offerers},
            template: function (data) {
                return offererItemTemplate(data);
            },
            selectable: "single",
            navigatable: true
        })
        $("#offerees-list-members").kendoListView({
            dataSource: {data: offeringsListObject.Offerees},
            template: function (data) {
                return offereeItemTemplate(data);
            },
            selectable: "single",
            navigatable: true
        })
        var stackedData = this.offeringsList.getAsStackedData()
        ChartsUtils.createStackedColumnsChart("Historique des prières et dons au Cénote", "dons", "mois", "main-overview-stacked-columns-chart", stackedData)
        ChartsUtils.createStackedAreaChart("Valeur cumulée des prières et dons au Cénote", "dons", "mois", "main-overview-stacked-area-chart", stackedData)
        this.renderOffererChart(null)
        this.renderOffereeChart(null)

    },
    renderOffererChart: function (nobleName) {
        var label = (nobleName == null) ? "Tous les nobles" : nobleName
        ChartsUtils.createPieChart(label, "offerers-pie-chart", this.offererChartData)
    },
    renderOffereeChart: function (godName) {
        var label = (godName == null) ? "Tous les dieux" : godName
        ChartsUtils.createPieChart(label, "offerees-pie-chart", this.offereeChartData)
    },
    events: {
        "click .offerer-name": "selectOfferer",
        "click .offeree-name": "selectOfferee",
        "click #offerers-list-header": "selectOfferer",
        "click #offerees-list-header": "selectOfferee"
    },
    setOfferingsList: function (offeringsList) {
        this.offeringsList = offeringsList
        this.render();
    },
    selectOfferer: function (event) {
        var offerer = null
        if (event.target.attributes["offerer"] != null) {
            offerer = event.target.attributes["offerer"].value
            $("#offerers-list-header").removeClass("k-state-selected")
        } else {
            $("#offerers-list-header").addClass("k-state-selected")
        }

        if (offerer == null) {
            this.offererChartData = this.offeringsList.getOfferersList(null)
            $("#offerers-list-members").data("kendoListView").clearSelection()
        } else {
            this.offererChartData = this.offeringsList.getOffereesList(offerer)
        }
        this.renderOffererChart(offerer)

    },
    selectOfferee: function (event) {
        var offeree = null
        if (event.target.attributes["offeree"] != null) {
            offeree = event.target.attributes["offeree"].value
            $("#offerees-list-header").removeClass("k-state-selected")
        } else {
            $("#offerees-list-header").addClass("k-state-selected")
        }

        if (offeree == null) {
            this.offereeChartData = this.offeringsList.getOffereesList(null)
            $("#offerees-list-members").data("kendoListView").clearSelection()
        } else {
            this.offereeChartData = this.offeringsList.getOfferersList(offeree)
        }
        this.renderOffereeChart(offeree)
    }

});
