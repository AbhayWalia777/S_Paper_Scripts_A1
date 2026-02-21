var myInterval,
    myInterval2,
    myInterval3,
    myInterval4,
    myInterval5,
    marginInterval,
    SocketInterval,
    ActiveSocketInterval,
    isLiveOrder,
    ActiveTradeAllData,
    Companyinitials,
    allowedTradingUnit,
    websocket,
    marketDepthInterval,
    favouriteWatchlistData = [],
    _WatchlistCurrentTabIndex = 0,
    _WatchListLength = 0,
    Completedpageno = 0,
    LastPriceDictionary = [],
    BtnIds = [],
    _WatchlistTotalPageNo = 0,
    _WatchlistCurrentPageNo = 1,
    _WatchlistPreviousTotalPageNo = 0,
    _isWatchlistCallBack = !1,
    _CompletedTotalPageNo = 0,
    _CompletedPreviousTotalPageNo = 0,
    _CompletedCurrentPageNo = 1,
    _CompletedCallBack = !1,
    _ActiveTotalPageNo = 0,
    _ActivePreviousTotalPageNo = 0,
    _ActiveCurrentPageNo = 1,
    _ActiveCallBack = !1,
    Current_Loop_Valueof_Watchlist = 0;
var allObj = [],
    allActiveAndWatchObj = [];
let socket;
let reconnectInterval = 5000; // milliseconds
function FavoriteWatchlist() {
    var e = favouriteWatchlistData;
    e.length > 0 &&
        $.map(e, function (e, t) {
            var a = parseFloat(e.Lastprice) - parseFloat(e.close),
                r = "",
                i = "";
            a < 0
                ? ((i = (parseFloat(a) / parseFloat(e.close)) * 100),
                    "CRYPTO" == e.Scripttype && (i = e.high),
                    "FOREX" == e.Scripttype && (i = 0),
                    (r = '  <i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp' + i.toFixed(2) + "</i>"))
                : a >= 0 &&
                ((i = (parseFloat(a) / parseFloat(e.close)) * 100),
                    "CRYPTO" == e.Scripttype && (i = e.high),
                    "FOREX" == e.Scripttype && (i = 0),
                    (r = '  <i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp' + i.toFixed(2) + "</i>"));
            var l = $(".favorite1");
            1 == t && (l = $(".favorite2")),
                $(l).html('<a style="font-size:15px;color:black;font-weight:bold" class="color-White-Link">' + e.ScriptTradingSymbol + '</a><a style="font-size:14px;font-weight:bold">  ' + e.Lastprice + "&nbsp&nbsp " + r + "</a>");
        });
}
$("#rdPercentage").on("change", function () {
    localStorage.setItem("changetype", "rdPercentage");
}),
    $("#ActiveTradeOnClick").modal("hide"),
    $("#rdAbsolute").on("change", function () {
        localStorage.setItem("changetype", "rdAbsolute");
    });
function initSocket() {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://Prod-tradingapi.sanaitatechnologies.com/hub/market", {
            withCredentials: true
        })
        .withAutomaticReconnect()
        .build();

    connection.on("ReceiveMarketUpdate", event => {

        var e = event.data;
        "undefined" != e &&
            (allActiveAndWatchObj = JSON.parse(e)).hasOwnProperty("Table") &&
            ((allObj = allActiveAndWatchObj.Table), allActiveAndWatchObj.hasOwnProperty("Table1") && (allActiveObj = allActiveAndWatchObj.Table1), wt(), setActiveSocketData());
    });

    connection.start()
        .then(() => {
            console.log("✅ Connected to market hub");
            connection.invoke("SubscribeUser", $("input[Name=hdnActiveUserID]").val());
        })
        .catch(err => {
            console.error("❌ Connection failed:", err);
        });

    connection.onreconnecting(() => {
        console.warn("🔄 Reconnecting...");
    });

    connection.onreconnected(() => {
        console.log("✅ Reconnected");
    });

    connection.onclose(() => {
        console.error("❌ Disconnected");
    });
}



var allActiveObj = [];
function wt() {
    var e = allObj;
    if (null != e && "undefined" != e && e.length > 0) {
        for (var t = document.getElementById("tblWatchListTradeListBody"), a = 0; a < t.rows.length;) {
            var r = e.filter((e) => e.InstrumentToken == $(t.rows[a].cells[1]).find("input[Name=hiddenCode]").val());
            if (r.length > 0 && null != r && "undefined" != r) {
                var i = r[0],
                    l = 0,
                    o = 0,
                    n = 0,
                    s = "",
                    d = "",
                    c = "";
                for (var p in LastPriceDictionary)
                    if (LastPriceDictionary[p].key == i.InstrumentToken) {
                        (l = parseFloat(LastPriceDictionary[p].value)),
                            (o = parseFloat(LastPriceDictionary[p].Bid)),
                            (n = parseFloat(LastPriceDictionary[p].Ask)),
                            (s = LastPriceDictionary[p].color),
                            (d = LastPriceDictionary[p].LastBidColor),
                            (c = LastPriceDictionary[p].LastAskColor);
                        break;
                    }
                var T = "";
                parseFloat(i.Lastprice) > l && ((T = '<span class="lp" >' + i.Lastprice + "</span>"), (s = "green")),
                    parseFloat(i.Lastprice) < l && ((T = '<span class="lp" >' + i.Lastprice + "</span>"), (s = "red")),
                    i.Lastprice == l && (T = '<span class="lp">' + i.Lastprice + "</span>"),
                    $(t.rows[a].cells[2]).css("background-color", s),
                    $(t.rows[a].cells[2]).html(T),
                    $(t.rows[a].cells[4]).html(i.BidQty);
                var u = "";
                parseFloat(i.Bid) > o && ((u = '<span class="lp">' + i.Bid + "</span>"), (d = "green")),
                    parseFloat(i.Bid) < o && ((u = '<span class="lp">' + i.Bid + "</span>"), (d = "red")),
                    i.Bid == o && (u = '<span class="lp">' + i.Bid + "</span>"),
                    $(t.rows[a].cells[5]).html(u),
                    $(t.rows[a].cells[5]).css("background-color", d);
                var b = "";
                parseFloat(i.Ask) > n && ((b = '<span class="lp">' + i.Ask + "</span>"), (c = "green")),
                    parseFloat(i.Ask) < n && ((b = '<span class="lp">' + i.Ask + "</span>"), (c = "red")),
                    i.Ask == n && (b = '<span class="lp">' + i.Ask + "</span>"),
                    $(t.rows[a].cells[6]).html(b),
                    $(t.rows[a].cells[6]).css("background-color", c),
                    $(t.rows[a].cells[7]).html(i.AskQty),
                    $(t.rows[a].cells[8]).html(i.Open),
                    $(t.rows[a].cells[9]).html(i.high),
                    $(t.rows[a].cells[10]).html(i.low),
                    $(t.rows[a].cells[11]).html(i.Close);
                var v = !1;
                for (var p in LastPriceDictionary)
                    LastPriceDictionary[p].key == i.InstrumentToken &&
                        ((v = !0),
                            (LastPriceDictionary[p].value = i.Lastprice),
                            (LastPriceDictionary[p].color = s),
                            (LastPriceDictionary[p].Bid = i.Bid),
                            (LastPriceDictionary[p].Ask = i.Ask),
                            (LastPriceDictionary[p].LastAskColor = i.LastAskColor),
                            (LastPriceDictionary[p].LastBidColor = i.LastBidColor));
                v || LastPriceDictionary.push({ key: i.InstrumentToken, value: i.Lastprice, color: s, Bid: i.Bid, Ask: i.Ask, LastBidColor: d, LastAskColor: c });
                var g = $(t.rows[a].cells[0]).find("input[Name=Scripttype]").val();
                null == i.Close && (i.Close = 0);
                var y = 0,
                    h = 0,
                    S = "";
                !0 == $("#rdPercentage").prop("checked")
                    ? (y = parseFloat(i.Lastprice) - parseFloat(i.Close)) < 0
                        ? (S = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + (h = "CRYPTO" == g ? i.Change : "FOREX" == g ? 0 : (parseFloat(y) / parseFloat(i.Close)) * 100).toFixed(2) + "&nbsp%</i>")
                        : y >= 0 &&
                        (S = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + (h = "CRYPTO" == g ? i.Change : "FOREX" == g ? 0 : (parseFloat(y) / parseFloat(i.Close)) * 100).toFixed(2) + "&nbsp%</i>")
                    : !0 == $("#rdAbsolute").prop("checked") &&
                    ((y = parseFloat(i.Lastprice) - parseFloat(i.Close)) < 0
                        ? (S = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + y.toFixed(2) + "</i>")
                        : y >= 0 && (S = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + y.toFixed(2) + "</i>")),
                    $(t.rows[a].cells[3]).html(S);
            }
            a++;
        }
        if ($("#buySellModel").hasClass("show")) {
            var r = e.filter((e) => e.InstrumentToken == $("#buySellModel #lblScriptCode").text());
            r.length > 0 &&
                null != r &&
                "undefined" != r &&
                ($("#buySellModel #lblLastPrice").text(r[0].Lastprice),
                    $("#buySellModel #lblLastBid").text(r[0].Bid),
                    $("#buySellModel #lblLastAsk").text(r[0].Ask),
                    $("#buySellModel #hdnHigh").text(r[0].high),
                    $("#buySellModel #hdnLow").text(r[0].low),
                    $("#buySellModel #hdnPrice").val(r[0].Lastprice));
        }
        null != favouriteWatchlistData &&
            favouriteWatchlistData.length > 0 &&
            $.map(favouriteWatchlistData, function (t, a) {
                var r = e.filter((e) => e.InstrumentToken == t.ScriptCode);
                if (r.length > 0 && null != r && "undefined" != r) {
                    var i = r[0];
                    (t.close = i.Close), (t.Lastprice = i.Lastprice), (t.high = i.Change);
                    var l = parseFloat(t.Lastprice) - parseFloat(t.close),
                        o = "",
                        n = "";
                    l < 0
                        ? (o =
                            '  <i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp' +
                            (n = "CRYPTO" == t.Scripttype ? t.high : "FOREX" == t.Scripttype ? 0 : (parseFloat(l) / parseFloat(t.close)) * 100).toFixed(2) +
                            "</i>")
                        : l >= 0 &&
                        (o =
                            '  <i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp' +
                            (n = "CRYPTO" == t.Scripttype ? t.high : "FOREX" == t.Scripttype ? 0 : (parseFloat(l) / parseFloat(t.close)) * 100).toFixed(2) +
                            "</i>");
                    var s = $(".favorite1");
                    1 == a && (s = $(".favorite2")),
                        $(s).html('<a style="font-size:15px;color:black;font-weight:bold" class="color-White-Link">' + t.ScriptTradingSymbol + '<a><astyle="fontsize:14px;fontweight:bold">  ' + t.Lastprice + "&nbsp&nbsp " + o + "</a>");
                }
            });
    }
}
function setActiveSocketData() {
    var e = allActiveObj,
        t = allObj,
        a = $("input[Name=hdnActiveUserID]").val(),
        r = ActiveTradeAllData,
        i = 0,
        l = e.filter((e) => e.UserID == parseInt(a)),
        o = !1;
    if (null != r && void 0 != r && r.ActiveTrade.length > 0) {
        if (l.length > 0 && null != r && l.length != r.ActiveTrade.length) SetTradeDataForWatch();
        else if (null != l && void 0 != l && l.length > 0)
            $.map(r.ActiveTrade, function (e, a) {
                var r = l.filter((t) => t.ActiveTradeID == e.ActiveTradeID);
                if (r.length > 0) {
                    var n = r[0],
                        s = t.filter((e) => e.InstrumentToken == n.ScriptCode);
                    (e.ObjScriptDTO.Lastprice = s[0].Lastprice),
                        (e.ObjScriptDTO.Ask = s[0].Ask),
                        (e.ObjScriptDTO.Bid = s[0].Bid),
                        (e.Qty = n.Qty),
                        (e.TSL = n.TSL),
                        e.Status != n.Status && (o = !0),
                        (e.Status = n.Status),
                        e.OrderPrice != n.OrderPrice && (o = !0),
                        (e.OrderPrice = n.OrderPrice),
                        e.PriceType != n.PriceType && (o = !0),
                        (e.PriceType = n.PriceType),
                        e.SL > 0 && (e.SLNew = e.OrderPrice - e.SL),
                        e.TGT2 > 0 && (e.TGNew = e.TGT2 - e.OrderPrice),
                        (e.CurrentPositionNew = e.CurrentPosition),
                        "Sell" == e.CurrentPositionNew.toLowerCase() && (e.SL > 0 && (e.SLNew = e.SL - e.OrderPrice), e.TGT2 > 0 && (e.TGNew = e.OrderPrice - e.TGT2)),
                        "COMPLETE" != e.Status.toUpperCase()
                            ? (e.Profitorloss = 0)
                            : "Buy" == e.CurrentPositionNew
                                ? e.IsLive
                                    ? ((e.Profitorloss = e.Qty * (e.ObjScriptDTO.Lastprice - e.OrderPrice)), (e.FinalProfitLoss = e.Qty * (e.ObjScriptDTO.Lastprice - e.OrderPrice)))
                                    : 0 == e.LAST_PRICE_TYPE && 0 != e.ObjScriptDTO.Bid
                                        ? ((e.Profitorloss = e.Qty * (e.ObjScriptDTO.Bid - e.OrderPrice)), (e.FinalProfitLoss = e.Qty * (e.ObjScriptDTO.Bid - e.CLOSING_PRICE)))
                                        : ((e.Profitorloss = e.Qty * (e.ObjScriptDTO.Lastprice - e.OrderPrice)), (e.FinalProfitLoss = e.Qty * (e.ObjScriptDTO.Lastprice - e.CLOSING_PRICE)))
                                : "Sell" == e.CurrentPositionNew &&
                                (e.IsLive
                                    ? ((e.Profitorloss = e.Qty * (e.OrderPrice - e.ObjScriptDTO.Lastprice)), (e.FinalProfitLoss = e.Qty * (e.OrderPrice - e.ObjScriptDTO.Lastprice)))
                                    : 0 == e.LAST_PRICE_TYPE && 0 != e.ObjScriptDTO.Ask
                                        ? ((e.Profitorloss = e.Qty * (e.OrderPrice - e.ObjScriptDTO.Ask)), (e.FinalProfitLoss = e.Qty * (e.CLOSING_PRICE - e.ObjScriptDTO.Ask)))
                                        : ((e.Profitorloss = e.Qty * (e.OrderPrice - e.ObjScriptDTO.Lastprice)), (e.FinalProfitLoss = e.Qty * (e.CLOSING_PRICE - e.ObjScriptDTO.Lastprice)))),
                        (i += e.Profitorloss);
                } else SetTradeDataForWatch();
            }),
                (ActiveTradeAllData = r),
                (r.TotalActiveTradeProfitOrLoss = i),
                !0 == o && SetTradeDataForWatch(),
                SetResult(JSON.stringify(r), o);
        else {
            var n = $("#tblActiveTradeList").DataTable();
            n.clear().draw(), (n.innerHTML = "");
            if (parseInt($('.TotalActiveTrade').html()) > 0) {
                // Your code here
                SetTradeDataForWatch();
            }
        }
    } else l.length > 0 && SetTradeDataForWatch();
}
function SetActiveTradeDetails(e, t) {
    var a,
        r,
        i = $("#CompanyInitial").val(),
        l = "'" + e.TradeSymbol + "'",
        o = "'" + e.ScriptInstrumentType + "'",
        n = "'" + e.ProductType + "'",
        s = "'" + e.PriceType + "'",
        d = "'" + e.CurrentPosition.toString() + "'",
        c = "'" + e.Status.toString() + "'",
        p = "'" + e.ObjScriptDTO.ScriptExchange.toString() + "'",
        T = "",
        u = "",
        b = "",
        v = !1;
    "Manual" == e.Strategyname && (v = !0);
    var g = $("#Role_Id").val(),
        y = e.CurrentPosition,
        h = 2,
        S = 0,
        P = "",
        L = "",
        f = "";
    1 == e.TRADING_UNIT_TYPE
        ? ((a = e.Qty / e.ObjScriptDTO.ScriptLotSize), (r = e.TRADING_UNIT))
        : ((r = e.TRADING_UNIT),
            e.ObjScriptDTO.ScriptLotSize > 10 && "MCX" == e.ObjScriptDTO.ScriptExchange && (("EXPO" == e.COMPANY_INITIAL && 51 == e.TENANT_ID) || ("ASR" == e.COMPANY_INITIAL && 57 == e.TENANT_ID) || "RVERMA" == e.COMPANY_INITIAL)
                ? ((a = e.Qty / (e.ObjScriptDTO.ScriptLotSize / 10)), (S = "(" + e.Qty + ")"))
                : (a = e.Qty)),
        "REJECTED" != e.Status.toUpperCase() &&
        ("Buy" == e.CurrentPositionNew && (h = 1),
            (P =
                ' <button class="btn btn-primary btn-sm" onclick="buySellPopUp(' +
                e.BuyQtyWiseOrLot +
                "," +
                e.ScriptCode +
                "," +
                h +
                "," +
                l +
                "," +
                e.WID +
                "," +
                e.OrderPrice +
                "," +
                o +
                "," +
                p +
                "," +
                a +
                "," +
                e.ObjScriptDTO.ScriptLotSize +
                "," +
                e.high +
                "," +
                e.low +
                "," +
                e.TriggerPrice +
                "," +
                e.SLNew +
                "," +
                e.TGNew +
                "," +
                s +
                "," +
                n +
                "," +
                e.ActiveTradeID +
                "," +
                c +
                "," +
                e.IsLive +
                ",'EDIT'," +
                e.TRADING_UNIT_TYPE +
                "," +
                e.TGT2 +
                "," +
                e.SL +
                ')" type="button"><i class="fa fa-pencil"></i></button> '),
            (T = ' <button class="btn btn-primary btn-sm" onclick="SquareOff(' + e.ActiveTradeID + "," + d + "," + c + "," + a + "," + v + "," + e.BuyQtyWiseOrLot + "," + e.ObjScriptDTO.ScriptLotSize + ')" type="button">Sqr Off</button> '),
            (u =
                ' <button class="btn btn-danger btn-sm btn-Sell" onclick="SquareOff(' +
                e.ActiveTradeID +
                "," +
                d +
                "," +
                c +
                "," +
                a +
                "," +
                v +
                "," +
                e.BuyQtyWiseOrLot +
                "," +
                e.ObjScriptDTO.ScriptLotSize +
                ')" type="button">Sqr Off</button> '),
            "MIS" == e.ProductType &&
            (b = ' <button title="Convert MIS to CNC" class="btn btn-primary btn-sm" onclick="convertButton(' + e.ActiveTradeID + "," + d + "," + c + "," + a + "," + v + ')" type="button"><i class="fa fa-exchange"></i></button> '),
            "OPEN" != e.Status.toUpperCase() && v && (L = '<button class="btn btn-primary btn-sm btn-Sell" onclick="AddQty(' + e.ActiveTradeID + "," + d + "," + c + "," + h + ')" type="button"><i class="fa fa-plus"></i></button>')),
        ("REJECTED" == e.Status.toUpperCase() || "OPEN" == e.Status.toUpperCase()) &&
        (f = '<button onclick = "DeleteRejectedTrade(' + e.ActiveTradeID + ')" type = "button" class="btn btn-warning btn-sm btn-delete" > <i class="fa fa-trash-o"></i></button >');
    var m = 0;
    "Buy" == e.CurrentPositionNew
        ? ((y = u), (m = 0 == e.LAST_PRICE_TYPE ? e.ObjScriptDTO.Bid : e.ObjScriptDTO.Lastprice))
        : "Sell" == e.CurrentPositionNew && ((y = T), (m = 0 == e.LAST_PRICE_TYPE ? e.ObjScriptDTO.Ask : e.ObjScriptDTO.Lastprice)),
        ("PB" == i || "KT" == i) && (L = ""),
        e.ActiveTradeID,
        e.ActiveTradeID;
    var C = P + "" + L + f + b;
    2 == parseInt(g) && !0 == e.IsCopyTradeFlag && ((C = "-"), (y = "-"));
    var D = "";
    D = "FOREX" == e.ObjScriptDTO.Scripttype ? e.TradeSymbol + " / " + e.ObjScriptDTO.Scriptsegment : e.TradeSymbol;
    var A = '<input Name="hiddenActiveTradeCode" value="' + e.ActiveTradeID + '" type="hidden" >',
        O = '<input Name="hiddenScriptCode" value="' + e.ScriptCode + '" type="hidden" > <input Name="hiddenScriptExchange" value="' + e.ObjScriptDTO.ScriptExchange.toString() + '" type="hidden" >',
        M = parseFloat(e.TriggerPrice);
    "FOREX" == e.ObjScriptDTO.Scripttype
        ? ((e.OrderPrice = e.OrderPrice.toFixed(5)),
            (e.ObjScriptDTO.Lastprice = e.ObjScriptDTO.Lastprice.toFixed(5)),
            (e.Profitorloss = e.Profitorloss.toFixed(5)),
            (e.SL = e.SL.toFixed(5)),
            (e.TGT2 = e.TGT2.toFixed(5)),
            (M = parseFloat(e.TriggerPrice).toFixed(5)))
        : (e.Profitorloss = parseFloat(e.Profitorloss).toFixed(4)),
        e.Status;
    var I = "";
    (I = "#tblActiveTradeList"),
        t &&
        ("SC" == i
            ? $(I)
                .DataTable()
                .row.add([y + A + O, C, D, a + S, r, e.CurrentPositionNew, e.OrderPrice, M, m, e.Profitorloss, e.Status == "COMPLETE" ? "ACTIVE" : e.Status, e.SL, e.TGT2, e.OrderDate, e.OrderTime, e.ProductType, e.Watchlistname, e.Fundmanagername, e.TSL])
                .draw()
            : $(I)
                .DataTable()
                .row.add([y + A + O, C, D, a + S, r, e.CurrentPositionNew, e.OrderPrice, M, m, e.Profitorloss, e.Status == "COMPLETE" ? "ACTIVE" : e.Status, e.SL, e.TGT2, e.OrderDate, e.OrderTime, e.ProductType, e.Strategyname, e.Publishname, e.Fundmanagername, e.TSL])
                .draw());
    for (var k = document.getElementById("tblActiveTradeBody"), x = 0; x < k.rows.length; x++) {
        $(k.rows[x].cells[0]).find("input[Name=hiddenActiveTradeCode]").val() == e.ActiveTradeID.toString() &&
            ($(k.rows[x].cells[3]).text(a + S), $(k.rows[x].cells[8]).text(m), $(k.rows[x].cells[9]).text(e.Profitorloss),
                $(k.rows[x].cells[19]).text(e.TSL),
                $(k.rows[x].cells[10]).text(e.Status == "COMPLETE" ? "ACTIVE" : e.Status), $(k.rows[x].cells[11]).text(e.SL), $(k.rows[x].cells[12]).text(e.TGT2));
        var E = parseFloat($(k.rows[x].cells[6]).text()),
            y = $(k.rows[x].cells[5]).text(),
            w = parseFloat($(k.rows[x].cells[12]).text()),
            N = parseFloat($(k.rows[x].cells[13]).text()),
            _ = parseFloat($(k.rows[x].cells[9]).text());
        $(k.rows[x].cells[3]).text() == e.TradeSymbol &&
            (0 == e.ExpireDays
                ? $(k.rows[x].cells[0]).append('<br /><span style="font-size:10px;color:red;"><b>(Expired)</b></span>')
                : 4 != e.ExpireDays && $(k.rows[x].cells[0]).append('<br /><span style="font-size:10px;color:red;"><b>(Expires ' + e.ExpireDays + " days)</b></span>")),
            ((E >= w && w > 0 && "Buy" == y) || (E <= w && w > 0 && "Sell" == y)) && ($(k.rows[x].cells[9]).css("background-color", "#14a964"), $(k.rows[x].cells[9]).css("color", "white")),
            ((E >= N && N > 0 && "Buy" == y) || (E <= N && N > 0 && "Sell" == y)) && ($(k.rows[x].cells[9]).css("background-color", "#14a964"), $(k.rows[x].cells[9]).css("color", "white")),
            _ >= 0 ? ($(k.rows[x].cells[9]).css("background-color", "green"), $(k.rows[x].cells[9]).css("color", "white")) : ($(k.rows[x].cells[9]).css("background-color", "red"),
                $(k.rows[x].cells[9]).css("color", "white"));
    }
}
function SetWatchTradeDetails(e) {
    var t = 0,
        a = 0,
        r = 0,
        i = "",
        l = "",
        o = "";
    for (var n in LastPriceDictionary)
        if (LastPriceDictionary[n].key == e.ScriptCode) {
            (t = parseFloat(LastPriceDictionary[n].value)),
                (a = parseFloat(LastPriceDictionary[n].Bid)),
                (r = parseFloat(LastPriceDictionary[n].Ask)),
                (i = LastPriceDictionary[n].color),
                (l = LastPriceDictionary[n].LastBidColor),
                (o = LastPriceDictionary[n].LastAskColor);
            break;
        }
    "FOREX" == e.Scripttype == Companyinitials && ((e.Lastprice = e.Lastprice.toFixed(5)), (e.Bid = e.Bid.toFixed(5)), (e.Ask = e.Ask.toFixed(5)));
    var s = "";
    parseFloat(e.Lastprice) > t && ((s = '<span class="lp">' + e.Lastprice + "</span>"), (i = "green")),
        parseFloat(e.Lastprice) < t && ((s = '<span class="lp">' + e.Lastprice + "</span>"), (i = "red")),
        e.Lastprice == t && (s = '<span class="lp">' + e.Lastprice + "</span>");
    var d = "";
    parseFloat(e.Bid) > a && ((d = '<span class="lp">' + e.Bid + "</span>"), (l = "green")), parseFloat(e.Bid) < a && ((d = '<span class="lp">' + e.Bid + "</span>"), (l = "red")), e.Bid == a && (d = '<span class="lp">' + e.Bid + "</span>");
    var c = "";
    parseFloat(e.Ask) > r && ((c = '<span class="lp">' + e.Ask + "</span>"), (o = "green")), parseFloat(e.Ask) < r && ((c = '<span class="lp">' + e.Ask + "</span>"), (o = "red")), e.Ask == r && (c = '<span class="lp">' + e.Ask + "</span>");
    var p = e.ScriptName.replace(/'/g, "");
    p = "'" + p + "'";
    var T = e.ScriptTradingSymbol.replace(/'/g, "");
    T = "'" + T + "'";
    var u = "'" + e.ScriptInstrumentType + "'",
        b = "'" + e.ScriptExchange.toString() + "'",
        v = "",
        g = "",
        y = "";
    "FOREX" == e.Scripttype
        ? (g = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp 0.00000 %</i>')
        : "CRYPTO" != e.Scripttype
            ? !0 == $("#rdPercentage").prop("checked")
                ? (v = parseFloat(e.Lastprice) - parseFloat(e.close)) < 0
                    ? (g = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + (y = (parseFloat(v) / parseFloat(e.close)) * 100).toFixed(5) + "&nbsp%</i>")
                    : v >= 0 && (g = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + (y = (parseFloat(v) / parseFloat(e.close)) * 100).toFixed(5) + "&nbsp%</i>")
                : !0 == $("#rdAbsolute").prop("checked") &&
                ((v = parseFloat(e.Lastprice) - parseFloat(e.close)) < 0
                    ? (g = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + v.toFixed(5) + "</i>")
                    : v >= 0 && (g = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + v.toFixed(5) + "</i>"))
            : "CRYPTO" == e.Scripttype &&
            (!0 == $("#rdPercentage").prop("checked")
                ? e.PerChange < 0
                    ? (g = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + e.PerChange.toFixed(5) + "&nbsp%</i>")
                    : e.PerChange >= 0 && (g = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + e.PerChange.toFixed(5) + "&nbsp%</i>")
                : !0 == $("#rdAbsolute").prop("checked") &&
                (e.ChangeInRupee < 0
                    ? (g = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + e.ChangeInRupee.toFixed(2) + "</i>")
                    : e.ChangeInRupee >= 0 && (g = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + e.ChangeInRupee.toFixed(2) + "</i>")));
    var h = "btnBuy" + e.ScriptCode,
        S = "btnSell" + e.ScriptCode,
        P = "btnMarketDepth" + e.ScriptCode,
        L = ' <button id="btnName' + e.ScriptCode + '" onclick="removeScript(' + e.ScriptCode + "," + e.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ',
        f =
            '<div tabindex="-1" class="b-btn"><button id="' +
            h +
            '" onclick="buySellPopUp(0,' +
            e.ScriptCode +
            ",1," +
            p +
            "," +
            e.WID +
            "," +
            e.Lastprice +
            "," +
            u +
            "," +
            b +
            ",1," +
            e.ScriptLotSize +
            "," +
            e.high +
            "," +
            e.low +
            ')" type="button" class="btn btn-success btn-sm btn-Buy"> B </button> ',
        m =
            '<button id="' +
            S +
            '" onclick="buySellPopUp(0,' +
            e.ScriptCode +
            ",2," +
            p +
            "," +
            e.WID +
            "," +
            e.Lastprice +
            "," +
            u +
            "," +
            b +
            ",1," +
            e.ScriptLotSize +
            "," +
            e.high +
            "," +
            e.low +
            ')" type="button" class="btn btn-danger btn-sm btn-Sell"> S </button> ',
        C = '<input Name="hiddenCode" value="' + e.ScriptCode + '" type="hidden" >',
        D = '<input Name="Scripttype" value="' + e.Scripttype + '" type="hidden" >',
        CH = '<button id="btnChart' + e.ScriptCode + '" ' +
            'data-scriptcode="' + e.ScriptCode + '" ' +
            'onclick="ViewChart(' + e.ScriptCode + ',' + p + ')" ' +
            'type="button" class="btn btn-icon  btn-sm btn-primary btn-ChartBtn" > C ' +
            '</button>',
        A = f + m + L + C + CH + D,
        O = $("#Role_Id").val();
    "RT" == Companyinitials && "2" == O && (A = C + D);
    var M = "";
    if (("" != e.Scriptexpiry && (M = '<span style="color: red;font-size: 13px;">Expires On : ' + e.Scriptexpiry.split(" ")[0] + "</span>"), $("#buySellModel #lblScriptCode").text() == e.ScriptCode.toString())) {
        var I = e.Lastprice.toString();
        $("#buySellModel #lblLastPrice").text(I), $("#buySellModel #lblLastBid").text(e.Bid), $("#buySellModel #lblLastAsk").text(e.Ask), $("#buySellModel #hdnPrice").val(I);
    }
    var k = "";
    (k = "FOREX" == e.Scripttype ? e.ScriptTradingSymbol + " / " + e.Scriptsegment : e.ScriptTradingSymbol),
        $("#tblWatchListTradeList")
            .DataTable()
            .row.add([k + M, A, s, g, e.BidQty, d, c, e.AskQty, e.open, e.high, e.low, e.close])
            .draw();
    //var x = document.getElementById("tblWatchListTradeList");
    //"green" == i ? $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[2]).css("background-color", "green") : $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[2]).css("background-color", "red"),
    //    "green" == o ? $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[6]).css("background-color", "green") : $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[6]).css("background-color", "red"),
    //    "green" == l ? $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[5]).css("background-color", "green") : $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[5]).css("background-color", "red"),
    //    $("#tblWatchListTradeList").removeClass("collapsed"),
    //    $("#tblWatchListTradeListBody > tr > td").addClass("padding-0px");
    var table = $('#tblWatchListTradeList').DataTable(); // Initialize DataTable

    table.rows().every(function () {
        let rowNode = this.node(); // Get the row's DOM element

        if ("green" == i) $(rowNode).find("td:eq(2)").css("background-color", "green");
        else $(rowNode).find("td:eq(2)").css("background-color", "red");

        if ("green" == o) $(rowNode).find("td:eq(6)").css("background-color", "green");
        else $(rowNode).find("td:eq(6)").css("background-color", "red");

        if ("green" == l) $(rowNode).find("td:eq(5)").css("background-color", "green");
        else $(rowNode).find("td:eq(5)").css("background-color", "red");
    });

    // Ensure the table remains expanded and formatted
    $("#tblWatchListTradeList").removeClass("collapsed");
    $("#tblWatchListTradeListBody > tr > td").addClass("padding-0px");

    var E = !1;
    for (var n in LastPriceDictionary)
        LastPriceDictionary[n].key == e.ScriptCode && ((E = !0), (LastPriceDictionary[n].value = e.Lastprice), (LastPriceDictionary[n].color = i), (LastPriceDictionary[n].LastAskColor = o), (LastPriceDictionary[n].LastBidColor = l));
    E || LastPriceDictionary.push({ key: e.ScriptCode, value: e.Lastprice, color: i, Bid: e.Bid, Ask: e.Ask, LastBidColor: l, LastAskColor: o });
    var w = !1;
    for (var n in BtnIds) BtnIds[n].BuyBtnId == h && (w = !0);
    w || BtnIds.push({ BuyBtnId: h, SellBtnId: S, DeleteBtnId: "btnName" + e.ScriptCode, MarketDepthBtnId: P });
}
$(document).ready(function () {
    var request = $.ajax({
        url: "/Admin/GetBalance",
        type: "GET",
        dataType: 'json',
        async: true,
        success: function (data) {
            $("#WalletBalance").text(data.amount);
        }
    });
    (allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val())), (isLiveOrder = $("#IsLive").val()), (Companyinitials = $("#CompanyInitial").val());
    var e = $("#Role_Id").val();
    "RT" == Companyinitials && "2" == e && $(".watchlistFilter").css("display", "none"), "BOB" == Companyinitials && $("#autoBinanceSLTrailDv").show();
    var t = localStorage.getItem("changetype");
    null == t ? $("#rdPercentage").prop("checked", !0) : $("#" + t).prop("checked", !0),
        $("#cbxOneClick").click(function () {
            !0 == $("#cbxOneClick").prop("checked") ? localStorage.setItem("IsOneClickEnabled", "1") : localStorage.setItem("IsOneClickEnabled", "0");
        }),
        $("#cbxEnableLimitOrders").click(function () {
            var e = 0;
            (e = !0 == $("#cbxEnableLimitOrders").prop("checked") ? 1 : 0),
                $.ajax({
                    url: "/Trade/Update_Enable_Limit_Orders_Flag?Enable_Limit_Orders_Flag=" + e,
                    type: "GET",
                    dataType: "json",
                    success: function (t) {
                        0 == t
                            ? (toastr.success("Updated Successfully"),
                                "1" == e ? ($("#cbxEnableLimitOrders").prop("checked", !0), $("#EnableLimitOrders").val("1")) : ($("#EnableLimitOrders").val("0"), $("#cbxEnableLimitOrders").prop("checked", !1)))
                            : toastr.error("Updated Failed");
                    },
                });
        }),
        $("#cbxHighLowCircuitRequired").click(function () {
            var e = 0;
            (e = !0 == $("#cbxHighLowCircuitRequired").prop("checked") ? 1 : 0),
                $.ajax({
                    url: "/Trade/Update_HighLowCircuitRequired?HighLowCircuitRequired=" + e,
                    type: "GET",
                    dataType: "json",
                    success: function (t) {
                        0 == t
                            ? (toastr.success("Updated Successfully"),
                                1 == e ? ($("#cbxHighLowCircuitRequired").prop("checked", !0), $("#HighLowCircuitRequired").val("1")) : ($("#HighLowCircuitRequired").val("0"), $("#cbxHighLowCircuitRequired").prop("checked", !1)))
                            : toastr.error("Updated Failed");
                    },
                });
        }),
        "1" == localStorage.getItem("IsOneClickEnabled") ? $("#cbxOneClick").prop("checked", !0) : $("#cbxOneClick").prop("checked", !1),
        $("#tblActiveTradeList").DataTable({ paging: !1, lengthChange: !1, info: !1, responsive: !0, processing: !0 }),
        $("#tblCompletedTradeList").DataTable({ paging: !1, lengthChange: !1, order: [[5, 0, "desc"]], info: !1, processing: !0, responsive: !0 }),
        $("#tblWatchListTradeList").DataTable({ paging: 1, lengthChange: !1, processing: !0, info: !0, ordering: !1, searching: !1, responsive: !0 }),
        SetTradeDataForWatch(),
        $("input[Name=MarketType]").on("click", function (e) {
            if ("1" == $("#EnableLimitOrders").val()) {
                var t = $(e.currentTarget).val(),
                    a = $("#hdnPrice").val(),
                    r = $("#hdnTriggerPrice").val();
                (r = r > 0 ? r : a),
                    $("#txtTarget").removeAttr("disabled"),
                    $("#txtTarget").removeAttr("readonly"),
                    $("#txtStopLoss").removeAttr("disabled"),
                    $("#txtStopLoss").removeAttr("readonly"),
                    "Limit" == t
                        ? ($("#buySellModel #price").removeAttr("disabled"),
                            $("#buySellModel #price").removeAttr("readonly"),
                            $("#buySellModel #price").val(a),
                            $("#buySellModel #TriggerPrice").val("0"),
                            $("#buySellModel #TriggerPrice").attr("disabled", "disabled"))
                        : "SL" == t
                            ? ($("#buySellModel #price").removeAttr("disabled"),
                                $("#buySellModel #price").removeAttr("readonly"),
                                $("#buySellModel #price").val(a),
                                $("#buySellModel #TriggerPrice").val(r),
                                $("#buySellModel #TriggerPrice").removeAttr("disabled"),
                                $("#buySellModel #TriggerPrice").removeAttr("readonly"))
                            : "SL-M" == t
                                ? ($("#buySellModel #txtTarget").val("0"),
                                    $("#buySellModel #txtStopLoss").val("0"),
                                    $("#buySellModel #TriggerPrice").removeAttr("disabled"),
                                    $("#buySellModel #TriggerPrice").removeAttr("readonly"),
                                    $("#buySellModel #TriggerPrice").val(r),
                                    $("#buySellModel #price").val("0"),
                                    $("#buySellModel #price").attr("disabled", "disabled"),
                                    $("#txtTarget").attr("disabled", "disabled"),
                                    $("#txtTarget").attr("readonly", "readonly"),
                                    $("#txtStopLoss").attr("disabled", "disabled"),
                                    $("#txtStopLoss").attr("readonly", "readonly"))
                                : "MARKET" == t &&
                                ($("#buySellModel #price").val("0"),
                                    $("#buySellModel #price").attr("disabled", "disabled"),
                                    $("#buySellModel #price").attr("readonly", "readonly"),
                                    $("#buySellModel #TriggerPrice").val("0"),
                                    $("#buySellModel #TriggerPrice").attr("disabled", "disabled"),
                                    $("#buySellModel #TriggerPrice").attr("readonly", "readonly"));
            } else $("#rbtnMarket").prop("checked", !0);
        });
    //(SocketInterval = setInterval(function () {
    //    initSocket();
    //}, 1000)),
    initSocket();
});
var pageno = 0;
function removeScript(e, t) {
    confirm("Are you sure you want to delete?") &&
        e > 0 &&
        t > 0 &&
        $.ajax({
            url: "/Watchlist/DeleteScript",
            type: "POST",
            data: { intWID: t, ScriptCode: e },
            dataType: "json",
            traditional: !0,
            success: function (e) {
                return JSON.parse(e).IsError ? (toastr.error("Can Not Delete This Record.There Is One Active Trade."), !1) : (toastr.success("Script Deleted Successfully."), SetTradeDataForWatch(), !1);
            },
        });
}
function setWatchlistData(e) {
    var t = JSON.parse(e);
    r = $("#tblWatchListTradeList").DataTable();
    r.clear().draw(), (r.innerHTML = "");
    if (null != t.objLstWatchList) {
        if (t.objLstWatchList.length > 0) {
            var a;
            $("#WalletBalance").html(t.UserWalletBalane);
            for (var i = 0; i < t.objLstWatchList.length; i++) {
                (_WatchlistTotalPageNo = t.objLstWatchList[i].Total_Page), (_WatchListLength = t.objLstWatchList.length), (a = t.objLstWatchList[i].Total_Page);
                var l = t.objLstWatchList[i];
                (Current_Loop_Valueof_Watchlist = i), SetWatchTradeDetails(l);
            }
            _WatchlistCurrentTabIndex > 0 && $("#tblWatchListTradeListBody > tr:nth-child(" + _WatchlistCurrentTabIndex + ") > td:nth-child(1)").addClass("hover"),
                _WatchlistPreviousTotalPageNo != a && WatchlistPaginationDestroy(),
                (_WatchlistPreviousTotalPageNo = t.objLstWatchList.length > 0 ? t.objLstWatchList[0].Total_Page : 1),
                SetWatchlistPagination();
        } else {
            var r = $("#tblWatchListTradeList").DataTable();
            r.clear().draw(), (r.innerHTML = "");
        }
        if (null != t.WatchlistDataForAdd && t.WatchlistDataForAdd.length > 0) for (var i = 0; i < t.WatchlistDataForAdd.length; i++) SetWatchTradeDetailsForAdd(t.WatchlistDataForAdd[i]);
    } else if (null != t.WatchlistDataForAdd) {
        if (t.WatchlistDataForAdd.length > 0) {
            //if (t.WatchlistDataForAdd.length > 50) $('#tblWatchListTradeList').DataTable().destroy(), $("#tblWatchListTradeList").DataTable({ paging: 1, lengthChange: !1, processing: !0, info: !0, ordering: !1, searching: !1, responsive: !0 });
            for (var i = 0; i < t.WatchlistDataForAdd.length; i++) SetWatchTradeDetailsForAdd(t.WatchlistDataForAdd[i]);

        }
    } else {
        var r = $("#tblWatchListTradeList").DataTable();
        r.clear().draw(), (r.innerHTML = "");
    }
    favouriteWatchlistData = t.objLstFavoriteWatchList;
}
function SetTradeDataForWatch() {
    try {
        var e = { searchedData: $("#SearchScript").val(), ScriptExchange: $("#DrScriptExchange  option:selected").val(), datalimit: 30 };
        $.ajax({
            url: "/Trade/SetTradeDataForNewUI",
            type: "GET",
            data: e,
            dataType: "json",
            async: !0,
            success: function (e) {
                setWatchlistData(e), SetResult(e, !0);
            },
        });
    } catch (t) {
        alert("Error On SetTradeData.4");
    }
}
function SetWatchTradeDetailsForAdd(e) {
    var t = "'" + e.ScriptTradingSymbol.toString() + "'",
        a = "'" + $("#DrScriptExchange  option:selected").val().toString() + "'",
        r = '<button class="btn btn-primary btn-sm btn-Sell" onclick="AddNewScript(' + t + "," + e.intWID + "," + a + "," + a + "," + e.UserID + "," + e.Lot + "," + e.size + ')" type="button"><i class="fa fa-plus"></i></button>';
    $("#tblWatchListTradeList").DataTable().row.add([e.ScriptTradingSymbol.toString(), r, "", "", "", "", "", "", "", "", "", ""]).draw();
}
function AddNewScript(e, t, a, r, i, l, o) {
    null != e &&
        "" != e &&
        void 0 != e &&
        null != r &&
        "" != r &&
        $.ajax({
            url: "/Watchlist/SaveWatchListFromIndex",
            type: "POST",
            data: { ScriptTradingSymbol: e, intWID: t, Watchlistname: a, ScriptExchange: r, txtUser: i, Lot: l, Size: o },
            dataType: "json",
            traditional: !0,
            success: function (e) {
                var t = JSON.parse(e);
                t.IsError && "MaxLimit" == t.ErrorMessage
                    ? toastr.error("Max 50 Scripts Allowed")
                    : t.IsExist
                        ? toastr.error("Duplicate Record")
                        : t.IsError
                            ? toastr.error("Something Went Wrong")
                            : t.IsError || "" == t.ScriptCode || null == t.ScriptCode || (toastr.success("Script Added Successfully"), $("#SearchScript").val(""), SetTradeDataForWatch());
            },
        });
}
function SetResult(e, t) {
    var a,
        r = JSON.parse(e),
        i = 0;
    if (null != r) {
        if (t) {
            var l = $("#tblActiveTradeList").DataTable();
            l.clear().draw(), (l.innerHTML = "");
        }
        if (r.ActiveTrade.length > 0) {
            ActiveTradeAllData = r;
            for (var o = 0; o < r.ActiveTrade.length; o++) {
                var n = r.ActiveTrade[o];
                r.ActiveTrade[o].Status, (_ActiveTotalPageNo = r.ActiveTrade[o].Total_Page), (a = r.ActiveTrade[o].Total_Page), SetActiveTradeDetails(n, t);
            }
        } else {
            var l = $("#tblActiveTradeList").DataTable();
            l.clear().draw(), (l.innerHTML = ""), (_ActiveTotalPageNo = 1), (a = 0);
        }
        var request = $.ajax({
            url: "/Admin/GetBalance",
            type: "GET",
            dataType: 'json',
            async: true,
            success: function (data) {
                $("#WalletBalance").text(data.amount);
                $("#ActiveWalletBalance").text((parseFloat(data.amount) + parseFloat(r.TotalActiveTradeProfitOrLoss)).toFixed(2));
            }
        });
        (_ActivePreviousTotalPageNo = r.ActiveTrade.length > 0 ? r.ActiveTrade[0].Total_Page : 1),
            "0.00" == r.TotalActiveTradeProfitOrLoss ? $(".TotalActiveTradeProfitOrLoss > h3").text("0") : $(".TotalActiveTradeProfitOrLoss > h3").text(parseFloat(r.TotalActiveTradeProfitOrLoss).toFixed(2));
        for (var o = 0; o < r.ActiveTrade.length; o++) "COMPLETE" == r.ActiveTrade[o].Status && i++;
        if (
            ($(".TotalActiveTrade").html(i),
                r.TotalActiveTradeProfitOrLoss >= 0
                    ? ($(".dvTotalActiveTradeProfitOrLoss").addClass("bg-green"), $(".dvTotalActiveTradeProfitOrLoss").removeClass("bg-red"))
                    : ($(".dvTotalActiveTradeProfitOrLoss").addClass("bg-red"), $(".dvTotalActiveTradeProfitOrLoss").removeClass("bg-green")),
                r.TotalCompletedTradeProfitOrLoss >= 0
                    ? ($(".dvTotalCompletedTradeProfitOrLoss").addClass("bg-green"), $(".dvTotalCompletedTradeProfitOrLoss").removeClass("bg-red"))
                    : ($(".dvTotalCompletedTradeProfitOrLoss").addClass("bg-red"), $(".dvTotalCompletedTradeProfitOrLoss").removeClass("bg-green")),
                r.TotalCompletedTradeCount > 0 && $(".TotalCompletedTrade").text(r.TotalCompletedTradeCount),
                $(".TotalCompletedTradeProfitOrLoss > h3").text(r.TotalCompletedTradeProfitOrLoss.toFixed(2)),
                null != r && null != r.OrderExceptionList && r.OrderExceptionList.length > 0)
        ) {
            for (
                var s = '<table class="table table-bordered table-striped" id="exceptionsTable"><thead><tr><th>TradingSymbol</th><th>Quantity</th><th>price</th><th>BuyOrSell</th><th>Message</th></tr></thead><tbody>', o = 0;
                o < r.OrderExceptionList.length;
                o++
            )
                s +=
                    "<tr><td>" +
                    r.OrderExceptionList[o].Tradingsymbol +
                    "</td><td>" +
                    r.OrderExceptionList[o].Quantity +
                    "</td><td>" +
                    r.OrderExceptionList[o].price +
                    "</td><td>" +
                    r.OrderExceptionList[o].TransactionType +
                    "</td><td>" +
                    r.OrderExceptionList[o].Message +
                    "</td></tr>";
            (s += "</tbody></table>"), $("#errorModal .modal-body").html(s), $("#errorModal").modal("show"); r.OrderExceptionList = null;
        }
    }
}
$(document).on('change input', '#buySellModel input, #buySellModel select, #buySellModel textarea', function () {
    formChanged = true;
});
var formChanged = false;
function buySellPopUp(e, t, a, r, i, l, o, n, s = 1, d = 1, c = 0, p = 0, T = 0, u = 0, b = 0, v = "", g = "", y = 0, h = "", S = "", P = "", L = "", TG = "", SL = "") {
    formChanged = false;
    $("#LblOrderPriceView").text("0"),
        $(".upperClause :input").removeAttr("disabled"),
        $("#btnProceedBuySell").removeAttr("disabled"),
        $("#price").removeClass("has-error"),
        $("#buySellModel .modal-title").css("color", "#fff"),
        $("#buySellModel #Terror").hide(),
        $("#buySellModel #Quantity-error").hide(),
        $("#buySellModel #hdnScriptExchange").val(n),
        $("#buySellModel #hdnScriptLotSize").val(d),
        $("#buySellModel #hdnHigh").val(c),
        $("#buySellModel #hdnLow").val(p),
        "" == S && (S = $("#hdnIsLiveOrder").val()),
        $("#buySellModel #hdnIsLive").val(S);
    var f = $("#CompanyInitial").val();
    "VM" == f && ($(".ProductTypeDiv").css("display", "none"), $(".TriggerPriceDiv").css("display", "none"), $(".rbtnSLDiv").css("display", "none"), $("#tgtSLDiv").css("display", "none"), $("#RememberDiv").css("display", "none")),
        "EXPO" == f && ($(".TriggerPriceDiv").css("display", "none"), $(".rbtnSLDiv").css("display", "none"), $("#RememberDiv").css("display", "none")),
        "MCX" != n ? ($("#QuantityWiseBuy").css("display", "none"), $("#marketTypeDiv").addClass("col-md-offset-4")) : ($("#QuantityWiseBuy").css("display", "block"), $("#marketTypeDiv").removeClass("col-md-offset-4"));
    var m = "";
    if (
        (1 == a ? ((m = "Buy"), $("#buySellModel .modal-title").css("background-color", "#00a65a")) : 2 == a && ((m = "Sell"), $("#buySellModel .modal-title").css("background-color", "#dd4b39")),
            $("#dropTradingUnit").html(""),
            null != allowedTradingUnit)
    ) {
        if (allowedTradingUnit.length > 0) {
            var C = allowedTradingUnit.filter((e) => e.ScriptExchange == n),
                D = [];
            "FUT" == o || "CE" == o || "PE" == o
                ? "FUT" == o
                    ? null == C[0].Future_Trading_Unit_Type || "" == C[0].Future_Trading_Unit_Type || void 0 == C[0].Future_Trading_Unit_Type
                        ? D.push(1)
                        : (D = C[0].Future_Trading_Unit_Type.split(","))
                    : null == C[0].Options_Trading_Unit_Type || "" == C[0].Options_Trading_Unit_Type || void 0 == C[0].Options_Trading_Unit_Type
                        ? D.push(1)
                        : (D = C[0].Options_Trading_Unit_Type.split(","))
                : null == C[0].Options_Trading_Unit_Type || "" == C[0].Options_Trading_Unit_Type || void 0 == C[0].Options_Trading_Unit_Type
                    ? D.push(1)
                    : (D = C[0].Equity_Trading_Unit_Type.split(",")),
                $.each(D, function (e, t) {
                    "0" == t && (t = "1"),
                        $("#dropTradingUnit").append(
                            $("<option></option>")
                                .val(parseInt(t))
                                .html("1" == t ? "Lot" : "Qty")
                        );
                });
        } else $("#dropTradingUnit").append($("<option></option>").val(parseInt(1)).html("Lot"));
    } else $("#dropTradingUnit").append($("<option></option>").val(parseInt(1)).html("Lot"));
    if (
        ($("#lblScriptSymbol").text(r.toString()),
            $("#lblScriptCode").text(t.toString()),
            $("#lblCurrentPosition").text(m),
            $("#WID").val(i),
            $("#hdnPrice").val(l),
            $("#hdnTradeID").val(y.toString()),
            $("#price").val("0"),
            $("#TriggerPrice").val(T.toString()),
            $("#hdnTriggerPrice").val(T.toString()),
            $("#txtStopLoss").val(u.toString()),
            $("#txtTarget").val(b.toString()),
            $("#Quantity").val(s.toString()),
            $("#hdnSt").val(h),
            "EQ" != o ? ($("#rbtnNrml").val("NRML"), $("#Itype").text("NRML")) : ($("#rbtnNrml").val("NRML"), $("#Itype").text("NRML")),
            "EDIT" == P &&
            ($("#LblOrderPriceView").text(l),
                "True" == $("#IsTargetStopLossAbsolute").val() &&
                ("Buy" == m.toLowerCase() ? ($("#txtStopLoss").val(SL > 0 ? SL : 0), $("#txtTarget").val(TG > 0 ? TG : 0)) : ($("#txtStopLoss").val(SL > 0 ? SL : 0), $("#txtTarget").val(TG > 0 ? TG : 0)))),
            0 == v.length)
    ) {
        var A = localStorage.getItem("RememberTargetStoploss");
        null != A
            ? ((A = JSON.parse(A)),
                $("#cbxRememberTargetStoploss").prop("checked", !0),
                null != A.PRODUCT_TYPE && "" != A.PRODUCT_TYPE && ("MIS" == A.PRODUCT_TYPE ? $("input[Name=ProductType]#rbtnIntraday").trigger("click") : $("input[Name=ProductType]#rbtnNrml").trigger("click")),
                null != A.PRICE_TYPE &&
                "" != A.PRICE_TYPE &&
                ("MARKET" == A.PRICE_TYPE
                    ? $("input[Name=MarketType]#rbtnMarket").trigger("click")
                    : "Limit" == A.PRICE_TYPE
                        ? $("input[Name=MarketType]#rbtnLimit").trigger("click")
                        : "SL" == A.PRICE_TYPE
                            ? $("input[Name=MarketType]#rbtnSL").trigger("click")
                            : "SL-M" == A.PRICE_TYPE && $("input[Name=MarketType]#rbtnSLM").trigger("click")),
                (v = $("input[Name=MarketType]:checked").val()))
            : ($("input[Name=MarketType]#rbtnMarket").trigger("click"), $("input[Name=ProductType]#rbtnNrml").trigger("click"));
    }
    null != v &&
        "" != v &&
        ("MARKET" == v
            ? $("input[Name=MarketType]#rbtnMarket").trigger("click")
            : "Limit" == v
                ? $("input[Name=MarketType]#rbtnLimit").trigger("click")
                : "SL" == v
                    ? $("input[Name=MarketType]#rbtnSL").trigger("click")
                    : "SL-M" == v && $("input[Name=MarketType]#rbtnSLM").trigger("click")),
        null != g && "" != g && ("MIS" == g ? $("input[Name=ProductType]#rbtnIntraday").prop("checked", !0) : $("input[Name=ProductType]#rbtnNrml").prop("checked", !0), $("#tgtSLDiv").show()),
        "COMPLETE" == h && $(".upperClause :input").attr("disabled", "disabled"),
        $("#buySellModel").modal({ backdrop: !1, show: !0 }),
        $(".modal-dialog").draggable({ handle: ".modal-header" }),
        $("body").removeClass("modal-open"),
        "" != L && $("#dropTradingUnit option[value=" + L + "]").attr("selected", "selected"),
        $("#dropTradingUnit").removeAttr("disabled"),
        "Open" == h && $("#dropTradingUnit").attr("disabled", "disabled"),
        "1" == localStorage.getItem("IsOneClickEnabled") && "EDIT" != P && ProceedBuySell(),
        GetRequiredMargin(),
        (marginInterval = setInterval(function () {
            GetRequiredMargin();
        }, 1e3));
    //debugger
}
function GetRequiredMargin() {
    if (
        parseInt($("#lblLastPrice").text()) > 0 &&
        parseInt($("#lblLastBid").text()) > 0 &&
        parseInt($("#lblLastAsk").text()) > 0
    ) {
        var e = 0,
            t = $("#buySellModel #hdnScriptLotSize").val();
        $("#buySellModel #DivGetLotSize").text(t);
        var a = $("#lblScriptCode").text(),
            r = $("#Quantity").val(),
            i = $("#WalletBalance").text(),
            l = $("#lblLastPrice").text(),
            o = document.getElementById("rbtnIntraday"),
            n = $("#lblCurrentPosition").text(),
            s = $("#buySellModel #hdnScriptExchange").val();
        if ((!0 == o.checked && (e = 1), "" != (l = "Buy" == n ? $("#lblLastAsk").text() : $("#lblLastBid").text()) && null != l)) {
            var d = "";
            l = parseFloat($('#price').val()) > 0 ? $('#price').val() : l;
            if ($('#Quantity').is(':disabled')) {
                // Your code here
                l = parseFloat($('#LblOrderPriceView').html());
            }
            (d = { ScriptLotSize: t, ScriptCode: a, quantity: r, Totalwalletbalance: i, MisOrNot: e, Lastprice: l, TRADING_UNIT_TYPE: $("#dropTradingUnit").val(), ScriptExchange: s, CurrentPosition: $('#lblCurrentPosition').html() }),
                $.ajax({
                    url: "/Trade/GetRequiredMargin",
                    type: "GET",
                    data: d,
                    dataType: "json",
                    success: function (e) {
                        var ee = JSON.parse(e);
                        SetRequiredMargin(ee);
                    },
                });
        }
    } else {
        $("#buySellModel #DivGetRequiredMargin").text(0);
        $("#buySellModel #DivGetAvailableMargin").text(0);
        $("#buySellModel #DivGetUsedMargin").text(0);
        $("#buySellModel #DivGetPledgeMargin").text(0);
    }
}
function SetRequiredMargin(e) {
    if (parseFloat($('#LblOrderPriceView').html()) === 0) {
        $('#DivLblOrderPriceView').hide();
    } else {
        $('#DivLblOrderPriceView').show();
    }
    if (null != e.length && e.length > 0) {
        $('#btnProceedBuySell').show();
        $('#MarginError').hide();
        if (e[0].Requiredmargin > e[0].Availablemargin) {
            $("#DivGetAvailableMargin").css("color", "red");
            if (parseInt($("#hdnTradeID").val()) == 0) {
                $('#btnProceedBuySell').hide();
                $('#MarginError').show();
            }
        } else {
            $("#DivGetAvailableMargin").css("color", "green");
            $('#btnProceedBuySell').show();
            $('#MarginError').hide();
        }
        $("#buySellModel #DivGetRequiredMargin").text(e[0].Requiredmargin);
        $("#buySellModel #DivGetAvailableMargin").text(e[0].Availablemargin);
        $("#buySellModel #DivGetUsedMargin").text(e[0].Usedmargin);
        $("#buySellModel #DivGetPledgeMargin").text(e[0].PledgeMargin);
        $("#buySellModel #CreditBalance").text(e[0].CreditBalance);
    } else {
        $("#buySellModel #DivGetRequiredMargin").text(0);
        $("#buySellModel #DivGetAvailableMargin").text(0);
        $("#buySellModel #DivGetUsedMargin").text(0);
        $("#buySellModel #DivGetPledgeMargin").text(0);
    }
}
function ProceedBuySell() {
    var T = $("#hdnTradeID").val();
    if (!formChanged && T > 0) {
        toastr.error("No changes detected. Please make a change before proceeding."); HidePopUp();
        return;
    }
    var e = $("#Quantity").val();
    if (e < 0.01) {
        toastr.error("Invalid Qty"), HidePopUp();
        return;
    }
    if (!0 == $("#cbxRememberTargetStoploss").prop("checked")) {
        var t = { PRODUCT_TYPE: $("input[Name=ProductType]:checked").val(), PRICE_TYPE: $("input[Name=MarketType]:checked").val() };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(t));
    } else localStorage.removeItem("RememberTargetStoploss");
    var a = 0;
    a = !0 == $("#cbxAutoBinanceSlTrail").prop("checked") ? 1 : 0;
    var r = $("#lblScriptCode").text(),
        i = $("#lblCurrentPosition").text();
    intWID = $("#WID").val();
    var l = $("#txtTarget").val(),
        o = $("#txtStopLoss").val(),
        e = $("#Quantity").val();
    $("#buySellModel #hdnScriptExchange").val(), $("#buySellModel #hdnScriptLotSize").val();
    var n = $("#buySellModel #hdnHigh").val(),
        s = $("#buySellModel #hdnLow").val(),
        d = $("#buySellModel #hdnIsLive").val(),
        c = $("#price").val(),
        p = $("#TriggerPrice").val(),
        u = $("input[Name=ProductType]:checked").val(),
        b = $("input[Name=MarketType]:checked").val(),
        v = $("#buySellModel #hdnPrice").val();
    if (null == r || "" == r || null == i || "" == i) {
        toastr.error("Please enter correct details");
        return;
    }
    if (0 == $("#HighLowCircuitRequired").val()) {
        var g = $("#CompanyInitial").val();
        if ("SL" == b || "SL-M" == b) {
            var y = parseFloat(c),
                h = parseFloat(p),
                S = parseFloat(v),
                P = !1,
                L = "";
            if (
                ("SL" == b &&
                    "EXPO" != g &&
                    ("Sell" == i && "SL" == b && y > h ? ((P = !0), (L = "Trigger price connot be less than order price")) : "Buy" == i && "SL" == b && y < h && ((P = !0), (L = "Trigger price Cannot be higher than order price"))),
                    "Sell" == i && h > S ? ((P = !0), (L = "Trigger price Cannot be higher than last price")) : "Buy" == i && h < S && ((P = !0), (L = "Trigger price connot be less than last price")),
                    P)
            ) {
                toastr.error(L), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
        if ("Limit" == b) {
            var price = parseFloat($('#price').val());
            if (isNaN(price) || price <= 0) {
                toastr.error("Please enter a valid price greater than 0 for Limit orders.");
                $('#price').focus();
                $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }

            var y = parseFloat(c),
                v = $("#buySellModel #hdnPrice").val(),
                S = parseFloat(v),
                P = !1,
                L = "";
            if (("Sell" == i && y < S ? ((P = !0), (L = "Limit price Cannot be less than last price")) : "Buy" == i && y > S && ((P = !0), (L = "Limit price connot be greater than last price")), P)) {
                $("#price").addClass("has-error"), toastr.error(L), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
    }
    if ((("" != o && "0" != o) || ("" != l && "0" != l)) && "false" == d.toLowerCase()) {
        var f = parseFloat(l),
            m = parseFloat(o),
            C = parseFloat(n),
            D = parseFloat(s),
            y = parseFloat(c),
            A = parseFloat(v);
        if ((y > 0 ? (A = y) : (y = A), "TB" == (g = $("#CompanyInitial").val()))) {
            var L = "";
            if (
                ("Buy" == i
                    ? (f > 0 && (f = A + f) < C && (L = "Target should be greater than high price"), m > 0 && (m = A - m) > D && (L = "StopLoss should be less than low price"))
                    : (f > 0 && (f = A - f) < D && (L = "Target should be less than low price"), m > 0 && (m = A + m) > C && (L = "StopLoss  should be greater than high price")),
                    "" != L)
            ) {
                toastr.error(L), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
        if ("True" == $("#IsTargetStopLossAbsolute").val()) {
            var L = "";
            if (
                ("Buy" == i
                    ? (f > 0 && f < y && (L = "Target should be greater than Order price"), m > 0 && m > y && (L = "StopLoss should be less than Order price"))
                    : (f > 0 && f > y && (L = "Target should be less than Order price"), m > 0 && m < y && (L = "StopLoss  should be greater than Order price")),
                    "" != L)
            ) {
                toastr.error(L), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
    }
    var O = $("#hdnSt").val(),
        M = $("#dropTradingUnit").val();
    r > 0 &&
        intWID > 0 &&
        "" != e &&
        "0" != e &&
        $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: {
                intWID: intWID,
                ScriptCode: r,
                CurrentPosition: i,
                allUsers: !1,
                target: l,
                stopLoss: o,
                Quantity: e,
                price: c,
                TriggerPrice: p,
                ProductType: u,
                MarketType: b,
                TradeID: T,
                Status: O,
                iscbxAutoBinanceSlTrailEnabled: a,
                TRADING_UNIT: M,
            },
            dataType: "json",
            async: !0,
            success: function (e) {
                var t = JSON.parse(e);
                return t.IsError ? (HidePopUp(), toastr.error(t.TypeName), !1) : ("0" != T ? toastr.success("Order Updated successfully") : toastr.success(t.SuccessMessage), SetTradeDataForWatch(), !1);
            },
        }),
        HidePopUp(),
        $("#btnProceedBuySell").removeAttr("disabled");
}
function HidePopUp() {
    clearInterval(marginInterval), $("#buySellModel").modal("hide");
}
$("#btnexport").click(function () {
    var e = $('#tblCompletedTradeList_filter input[type="search"]').val();
    window.location = '/Trade/download?search="' + e + '"';
}),
    $("#watchList").on("change", function () {
        var e = this.value;
        $("#watchlistHiddenId").val(e), (_WatchlistCurrentPageNo = 1), SetTradeDataForWatch();
    }),
    $("#cboScriptExchange").on("change", function () {
        try {
            (_WatchlistCurrentPageNo = 1), SetTradeDataForWatch();
        } catch (e) {
            alert("Error On SetTradeData.6");
        }
    });
var sqModal = $("#sqOfModal");
function SquareOff(e, t, a, r, i, l, o) {
    $(sqModal).find(".sqMsg").text(""),
        $(sqModal).find("input[Name=sqQty]").val(r),
        $(sqModal).find("input[Name=hdQty]").val(r),
        $(sqModal).find("input[Name=sqActiveTradeID]").val(e),
        $(sqModal).find("input[Name=sqStatus]").val(a),
        $(sqModal).find("input[Name=sqParam]").val(t),
        $(sqModal).find("input[Name=QtyOrLotWise]").val(l),
        $(sqModal).find("input[Name=lotsize]").val(o),
        i ? $(sqModal).modal("show") : confirm("Are you sure to square off?") && ProceedSqOf();
}
function ProceedSqOf() {
    $(sqModal).find(".sqMsg").text("");
    var e = $(sqModal).find("input[Name=sqQty]").val(),
        t = $(sqModal).find("input[Name=hdQty]").val(),
        a = $(sqModal).find("input[Name=QtyOrLotWise]").val(),
        r = $(sqModal).find("input[Name=lotsize]").val(),
        i = 0;
    if ("" == parseInt(e) || 0 == parseInt(e) || (i = parseInt(e, 10)) > parseInt(t, 10)) return $("#btnProceedSquareOff").removeAttr("disabled"), toastr.error("Invalid Qty"), !1;
    var l = $(sqModal).find("input[Name=sqActiveTradeID]").val(),
        o = $(sqModal).find("input[Name=sqStatus]").val(),
        n = $(sqModal).find("input[Name=sqParam]").val();
    $.ajax({
        url: "/Trade/ManageTradeSquareOff",
        type: "POST",
        data: { ID: l, actionParam: n, Status: o, Qty: i, BuyQtyWiseOrLot: a, ScriptLotSize: r },
        dataType: "json",
        traditional: !0,
        success: function (e) {
            var t = JSON.parse(e);

            SetTradeDataForWatch();
            return 1 == t.exceptionDTO.id ? toastr.success(t.exceptionDTO.Msg) : 0 == t.exceptionDTO.id ? toastr.success(t.exceptionDTO.Msg) : 2 == t.exceptionDTO.id && toastr.success(t.exceptionDTO.Msg), SetTradeData(), !1;

        },
    }),
        $("#btnProceedSquareOff").removeAttr("disabled"),
        $(sqModal).modal("hide");
}
var convertMisToCncModal = $("#convertMisToCncModal");
function ConvertMISToCNC() {
    var e = $(convertMisToCncModal).find("input[Name=convertActiveTradeID]").val(),
        t = $(convertMisToCncModal).find("input[Name=convertStatus]").val(),
        a = $(convertMisToCncModal).find("input[Name=convertParam]").val(),
        r = $(convertMisToCncModal).find("input[Name=hdQty]").val();
    $.ajax({
        url: "/Trade/ConvertMisToCnc",
        type: "POST",
        data: { ID: e, actionParam: a, Status: t, Qty: r },
        dataType: "json",
        traditional: !0,
        success: function (e) {
            var t = JSON.parse(e);
            return $("#errorModal .modal-body").html('<p class="text-success">' + t.exceptionDTO.Msg + "</p>"), $("#errorModal").modal("show"), !1;
        },
    }),
        $("#btnconvertMisToCnc").removeAttr("disabled"),
        $(convertMisToCncModal).modal("hide");
}
function convertButton(e, t, a, r, i) {
    $(convertMisToCncModal).find("input[Name=convertQty]").val(r),
        $(convertMisToCncModal).find("input[Name=hdQty]").val(r),
        $(convertMisToCncModal).find("input[Name=convertActiveTradeID]").val(e),
        $(convertMisToCncModal).find("input[Name=convertStatus]").val(a),
        $(convertMisToCncModal).find("input[Name=convertParam]").val(t),
        i ? $(convertMisToCncModal).modal("show") : confirm("Are you sure to square off?") && ConvertMISToCNC();
}
function CallSync(e) {
    confirm("Are you sure to sync order?") &&
        $.ajax({
            url: "/Trade/CallSync",
            type: "POST",
            data: { ID: e },
            dataType: "json",
            traditional: !0,
            success: function (e) {
                return JSON.parse(e), $("#errorModal .modal-body").html('<p class="text-success">Order Sync request sent successfully</p>'), $("#errorModal").modal("show"), !1;
            },
        });
}
function MarketDepthPop(e, t) {
    var a = '<button type="button" class="btn btn-success" onclick="HideDepthModal();$(\'#btnBuy' + e + "').click()\">Buy</button>";
    (a += '<button type="button" class="btn btn-danger" onclick="HideDepthModal();$(\'#btnSell' + e + "').click()\">Sell</button>"),
        $("#MarketDepthModal #buySellButtonDiv").html(a),
        $("#MarketDepthModal #lblDepthScriptSymbol").text(t),
        $("#MarketDepthModal #hdnDepthScriptCode").val(e),
        $.ajax({
            url: "/Trade/_MarketDepth",
            type: "POST",
            data: { ScriptCode: e },
            success: function (e) {
                return (
                    $("#MarketDepthModal .modal-body").html(e),
                    $("#MarketDepthModal").modal({ backdrop: !1, show: !0 }),
                    $("body").removeClass("modal-open"),
                    (marketDepthInterval = setInterval(function () {
                        SetMarketDepthForRefresh();
                    }, 1e3)),
                    !1
                );
            },
        });
}
function SetMarketDepthForRefresh() {
    var e = $("#MarketDepthModal #hdnDepthScriptCode").val();
    $.ajax({
        url: "/Trade/_MarketDepth",
        type: "POST",
        data: { ScriptCode: e },
        async: !1,
        success: function (e) {
            return $("#MarketDepthModal #lblDepthLTP").text("(" + $("#hdnDepthLTP").val() + ")"), $("#MarketDepthModal .modal-body").html(e), !1;
        },
    });
}
function HideDepthModal() {
    clearInterval(marketDepthInterval), $("#MarketDepthModal").modal("hide");
}
function HideCompletedTradeModal() {
    $("#CompletedTradeModal").modal("hide");
}
function btnLoginToTradeUsingModal() {
    var e = $("#btnKiteLogin").attr("href");
    return (
        $.ajax({
            url: e,
            type: "GET",
            data: {},
            dataType: "json",
            traditional: !0,
            success: function (e) {
                var t = e;
                if ("" == t) return $("#txtScript").val(""), ShowAlertMessage(1, "Login Sccuessfully."), !1;
                window.location.href = t;
            },
        }),
        !1
    );
}
function SetWatchlistPagination() {
    $("#WatchlistPagination").twbsPagination({
        totalPages: _WatchlistTotalPageNo,
        visiblePages: 2,
        onPageClick: function (e, t) {
            _isWatchlistCallBack ? ((_WatchlistCurrentPageNo = t), (LastPriceDictionary = []), (BtnIds = []), (_WatchlistCurrentTabIndex = 0), SetTradeDataForWatch()) : (_isWatchlistCallBack = !0);
        },
    });
}
function WatchlistPaginationDestroy() {
    $("#WatchlistPagination").empty(), $("#WatchlistPagination").removeData("twbs-pagination"), $("#WatchlistPagination").unbind("page");
}
function SetCompletedPagination() {
    $("#CompletedPagination").twbsPagination({
        totalPages: _CompletedTotalPageNo,
        visiblePages: 2,
        onPageClick: function (e, t) {
            _CompletedCallBack
                ? ((_CompletedCurrentPageNo = t), SetCompletedTradeModalData(false)) // 👈 don't show modal on page click
                : (_CompletedCallBack = true);
        },
    });
}
function CompletedPaginationDestroy() {
    $("#CompletedPagination").empty(), $("#CompletedPagination").removeData("twbs-pagination"), $("#CompletedPagination").unbind("page");
}
function SetActiveTradePagination() {
    $("#ActiveTradePagination").twbsPagination({
        totalPages: _ActiveTotalPageNo,
        visiblePages: 2,
        onPageClick: function (e, t) {
            _ActiveCallBack ? (_ActiveCurrentPageNo = t) : (_ActiveCallBack = !0), SetTradeDataForWatch();
        },
    });
}
function ActiveTradePaginationDestroy() {
    $("#ActiveTradePagination").empty(), $("#ActiveTradePagination").removeData("twbs-pagination"), $("#ActiveTradePagination").unbind("page");
}
function SetCompletedTradeModalData(showModal) {
    try {
        var e = $("#watchlistHiddenId").val(),
            t = $("#cboScriptExchange option:selected").val(),
            a = $("#rdAll").prop("checked")
                ? { tradetype: 0, WID: e, scriptExchangeType: t, CompletedListPage: _CompletedCurrentPageNo }
                : $("#rdLive").prop("checked")
                    ? { tradetype: 1, WID: e, scriptExchangeType: t, CompletedListPage: _CompletedCurrentPageNo }
                    : { tradetype: 2, WID: e, scriptExchangeType: t, CompletedListPage: _CompletedCurrentPageNo };

        $.ajax({
            url: "/Trade/SetCompletedTradeData",
            type: "GET",
            data: a,
            dataType: "json",
            async: true,
            success: function (e) {
                var t = JSON.parse(e);
                if (t && t.CompletedTrade && t.CompletedTrade.length > 0) {
                    var r = $("#tblCompletedTradeList").DataTable();
                    r.clear().draw();

                    for (var i = 0; i < t.CompletedTrade.length; i++) {
                        _CompletedTotalPageNo = t.CompletedTrade[i].Total_Page;
                        SetCompletedTradeTableDetails(t.CompletedTrade[i]);
                    }

                    if (_CompletedPreviousTotalPageNo != _CompletedTotalPageNo) CompletedPaginationDestroy();
                    _CompletedPreviousTotalPageNo = _CompletedTotalPageNo || 1;

                    SetCompletedPagination();
                    setTimeout(() => {
                        if (showModal) {
                            $("#CompletedTradeModal")
                                .off("shown.bs.modal") // Remove any existing handlers
                                .on("shown.bs.modal", function () {
                                    r.columns.adjust().draw(); // ✅ Now adjusts after modal is fully visible
                                })
                                .modal("show");
                        } else {
                            r.columns.adjust().draw(); // ✅ Just adjust immediately for pagination
                        }
                    }, 200);
                } else if (showModal) {
                    $("#CompletedTradeModal").modal("show"); // still show modal if no data
                }
            },
            error: function () {
                alert("Error loading completed trade data.");
            }
        });
    } catch (r) {
        alert("Error On SetTradeData.");
    }
}


function SetCompletedTradeTableDetails(e) {
    e.Completedtradeid, "TGT2" == e.Status ? (e.Status = "TARGET") : "TGT3" == e.Status ? (e.Status = "TARGET2") : "TGT4" == e.Status ? (e.Status = "TARGET3") : "SL" == e.Status && (e.Status = "STOPLOSS");
    var t,
        a,
        r =
            '<a href="javascript:void(0)" id="GetCompletedTradeDetail" onclick="ShowDetails(this)" data-bind=' +
            e.Completedtradeid +
            ' ><i class="fa fa-info-circle"></i> </a>  <a href="javascript:void(0)" class="hideTranDetailRow" onclick="HideDetails(this)" style = "margin-left: 15px;font-size:15px;display:none;" ><i class="fa fa-arrow-circle-up"></i></a> <p style="margin-left: 10px;">  ' +
            e.Completedtradeid +
            "</p> ",
        i = "";
    (i = "FOREX" == e.Scripttype ? e.TradeSymbol + " / " + e.Scriptsegment : e.TradeSymbol),
        $("#CompanyInitial").val(),
        1 == e.TRADING_UNIT_TYPE
            ? ((t = e.Qty / e.ScriptLotSize), (a = e.TRADING_UNIT))
            : ((a = e.TRADING_UNIT),
                (t =
                    e.ScriptLotSize > 10 && "MCX" == e.ScriptExchange && (("EXPO" == e.COMPANY_INITIAL && 51 == e.TENANT_ID) || ("ASR" == e.COMPANY_INITIAL && 57 == e.TENANT_ID) || "RVERMA" == e.COMPANY_INITIAL)
                        ? e.Qty / (e.ScriptLotSize / 10)
                        : e.Qty)),
        $("#tblCompletedTradeList").DataTable().row.add([r, i, t, a, e.Profitorloss, e.Entrytime, e.CurrentPosition, e.Status]).order([0, "desc"]).draw();
    for (var l = document.getElementById("tblCompletedTradeList"), o = 0; o < l.rows.length; o++) {
        var n = $(l.rows[o].cells[7]).text();
        ("TARGET" == n || "TARGET2" == n || "TARGET3" == n) && ($(l.rows[o].cells[7]).css("background-color", "#14a964"), $(l.rows[o].cells[7]).css("color", "white")),
            "STOPLOSS" == n && ($(l.rows[o].cells[7]).css("background-color", "#d83824"), $(l.rows[o].cells[7]).css("color", "white"));
        var s = $(l.rows[o].cells[4]).text();
        parseFloat(s) >= 0
            ? ($(l.rows[o].cells[4]).css("background-color", "#14a964"), $(l.rows[o].cells[4]).css({ color: "white", "font-weight": "bold" }))
            : 0 > parseFloat(s) && ($(l.rows[o].cells[4]).css("background-color", "#d83824"), $(l.rows[o].cells[4]).css({ color: "white", "font-weight": "bold" }));
    }
}
function BindClick() {
    $("#GetCompletedTradeDetail").bind("click", function () {
        $(".hideTranDetailRow").hide();
        var e = $(this).closest("tr"),
            t = $(e).find(".hideTranDetailRow");
        $(t).show();
        var a = $(this).data("bind");
        $.ajax({
            url: "/Trade/SetCompletedTradeDetailData?Completedtradeid=" + a,
            type: "GET",
            async: !0,
            success: function (t) {
                null != t && ($("#TranDetail").remove(), $(t).insertAfter(e));
            },
        });
    });
}
$("#btnMoreInfoCompletedTrade").on("click", function () {
    SetCompletedTradeModalData(true); // show modal after data load
}),
    $("#btnMoreInfoCompletedTrade2").on("click", function () {
        SetCompletedTradeModalData(true); // show modal after data load
    }),
    $("#SqrOffAllBtn").on("click", function () {
        confirm("Are You Sure You Want To Sqr-Off All Trades ?") && (window.location.href = "/Trade/SqrOffAll");
    });
var addQtyModal = $("#addQtyModal");
function AddQty(e, t, a, r) {
    $(addQtyModal).find(".sqMsg").text(""),
        $(addQtyModal).find("#btnProceedAddQty").removeAttr("disabled"),
        $(addQtyModal).find("input[Name=sqActiveTradeID]").val(e),
        $(addQtyModal).find("input[Name=sqStatus]").val(a),
        $(addQtyModal).find("input[Name=BuyOrSell]").val(r),
        $(addQtyModal).find("input[Name=sqParam]").val(t),
        $(addQtyModal).find("input[Name=sqQty]").val("1"),
        $(addQtyModal).modal("show");
}
function ProceedAddQty() {
    $(addQtyModal).find(".sqMsg").text("");
    var e = $(addQtyModal).find("input[Name=sqQty]").val(),
        t = 0;
    if ("" == parseInt(e) || 0 == parseInt(e)) return $(addQtyModal).find("#btnProceedAddQty").removeAttr("disabled"), toastr.error("Invalid Qty"), !1;
    t = parseInt(e, 10);
    var a = $(addQtyModal).find("input[Name=sqActiveTradeID]").val(),
        r = $(addQtyModal).find("input[Name=sqStatus]").val(),
        i = $(addQtyModal).find("input[Name=sqParam]").val(),
        l = $(addQtyModal).find("input[Name=BuyOrSell]").val();
    $.ajax({
        url: "/Trade/AddQtyToActiveTrade",
        type: "POST",
        data: { ID: a, actionParam: i, Status: r, Qty: t, BuyOrSell: l },
        dataType: "json",
        traditional: !0,
        success: function (e) {
            var t = JSON.parse(e);
            return 1 == t.exceptionDTO.id ? toastr.success(t.exceptionDTO.Msg) : 0 == t.exceptionDTO.id && toastr.error(t.exceptionDTO.Msg), !1;
        },
    }),
        $(addQtyModal).find("#btnProceedAddQty").removeAttr("disabled"),
        $(addQtyModal).modal("hide");
}
function DeleteRejectedTrade(e) {
    confirm("Are you sure you want to delete?") &&
        $.ajax({
            url: "/Trade/DeleteRejectedTrade?ID=" + e,
            type: "GET",
            async: !0,
            success: function (e) {
                null != e && toastr.success(e), SetTradeDataForWatch();
            },
        });
}
function ShowDetails(e) {
    $(".hideTranDetailRow").hide();
    var t = $(e).closest("tr"),
        a = $(t).find(".hideTranDetailRow");
    $(a).show();
    var e = $(e).data("bind");
    $.ajax({
        url: "/Trade/SetCompletedTradeDetailData?Completedtradeid=" + e,
        type: "GET",
        async: !0,
        success: function (e) {
            null != e && ($("#TranDetail").remove(), $(e).insertAfter(t));
        },
    });
}
function HideDetails(e) {
    $(e).css("display", "none"), $("#TranDetail").remove();
}
$("#SearchScript").on("keyup", function () {
    SetTradeDataForWatch();
});
$("#DrScriptExchange").on("change", function () {
    if ($('#DrScriptExchange').val() == '') {
        $('#SearchScript').hide();
        $('#SearchScript').val('');
    }
    else
        $('#SearchScript').show();
    SetTradeDataForWatch();
});
function ViewChart(scriptCode, ScriptSymbol) {
    console.log("Loading chart for:", scriptCode);

    // example:
    $('#ModalBasicChart').data('scriptcode', scriptCode);
    $("#Chart-modal-title").text(ScriptSymbol.toString());
    $("#ModalBasicChart").modal("show");
    $('#ModalBasicChart').dialog({
        open: function () {
            currentScriptCode = $(this).data('scriptcode');

            resetChartState();
            initChart();
            attachUIEvents();
            loadChartData();
        },
        close: function () {
            stopAutoRefresh();
        }
    });
    // load chart data here

}
function HideModalBasicChart() {
    $('#ModalBasicChart').dialog('destroy');
    $("#ModalBasicChart").modal("hide");
}