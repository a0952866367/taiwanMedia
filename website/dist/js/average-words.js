function addVisWord(a, n) {
    var s = ".avgWords-container ." + a + "-container",
        i = "<h3>" + mediaEN2C[a] + "</h3><span>" + n + '</span><span class="avgWords-scale">字</span>',
        r = '<div class="visbar"></div>'.repeat(n / 10);
    $(s).html(i + r)
}

function clearVisWord() {
    $(".avgWords-container .visWords-container").each(function(a) {
        var n = $(this).find("h3").text();
        $(this).html("<h3>" + n + "</h3>")
    })
}