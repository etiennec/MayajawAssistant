MarketAnalysisView = Backbone.View.extend({
    initialize: function () {
        this.marketOpsList = null;
        this.nobleName = null;
        this.render();
    },
    render: function () {
        var that = this

        if (this.marketOpsList === null) {
            return;
        }

        var viewTemplate = Handlebars.compile($("#market-analysis-tmpl").html())
        var nobleItemTemplate = Handlebars.compile($("#noble-list-item-tmpl").html())
        this.$el.html(viewTemplate())
        $("#nobles-list-members").kendoListView({
            dataSource: {data: this.marketOpsList.getNoblesDataSource()},
            template: function (data) {
                return nobleItemTemplate(data);
            },
            selectable: "single",
            navigatable: true
        })
        this.updateItemsList(this.nobleName);
    },
    events: {
        "click .noble-name": "selectNoble",
        "click #noble-list-header": "selectNoble"
    },
    updateItemsList: function (nobleName) {
        var that = this;

        var treeview = $("#market-items-treeview").data("kendoTreeView");

        if (treeview != null) {
            treeview.setDataSource(that.marketOpsList.getItemsDataSource(that.nobleName));
        } else {
            $("#market-items-treeview").kendoTreeView({
                checkboxes: {
                    checkChildren: false
                },
                dataSource: {data: that.marketOpsList.getItemsDataSource(that.nobleName)}
            });
        }



        if (nobleName != null) {
            // All check box should be selected.
            $("#market-items-treeview>ul>li input").prop('checked', true);
        }

        // We need to manually check/uncheck the children when category checkbox is clicked. There's a bug with FF/KendoUI.
        $("#market-items-treeview>ul>li>div input").click(function (e) {
            var checked = $(this).prop('checked');
            $(this).closest('li').children('ul').find('input').prop('checked', checked);
        });

        $("span.k-checkbox input[type='checkbox']").click(function (e) {
            that.updateCharts();
        });
    },
    setMarketOpsList: function (marketOpsList) {
        this.marketOpsList = marketOpsList;
        this.render();
    },
    getSelectedItems: function () {
        var selectedItems = []

        $("#market-items-treeview ul li ul li div").each(function () {
            if ($(this).find("input[type=checkbox]:checked").length > 0) {
                var itemName = $(this).find("span.k-in").text();
                MSUtils.addToSet(itemName, selectedItems);
            }
        });

        return selectedItems;
    },
    // Retrieve the list of items selected, and update all the charts.
    updateCharts: function () {
        var selectedItems = this.getSelectedItems();
        var chartsData = this.marketOpsList.getChartData(selectedItems, this.nobleName);
        ChartsUtils.createPieChart("Ventes (Total)", "market-sellers-pie-chart", chartsData.sellers)
        ChartsUtils.createPieChart("Achats (Total)", "market-buyers-pie-chart", chartsData.buyers)
        ChartsUtils.createStackedColumnsChart("Historique des achats", "achats", "mois", "market-stacked-column-buys-chart", chartsData.buys)
        ChartsUtils.createStackedColumnsChart("Historique des ventes", "ventes", "mois", "market-stacked-column-sells-chart", chartsData.sells)

    },
    selectNoble: function (event) {
        var nobleName = null
        if (event.target.attributes["noble"] != null) {
            nobleName = event.target.attributes["noble"].value
            $("#noble-list-header").removeClass("k-state-selected")
        } else {
            $("#noble-list-header").addClass("k-state-selected")
            $("#nobles-list-members").data("kendoListView").clearSelection()
        }

        this.nobleName = nobleName;
        this.updateItemsList(nobleName);
        this.updateCharts();
    }
});
