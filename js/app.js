$(document).ready(function () {
    $('.mobmenu').click(function () {
        $('.menu ul').show();
    })
    $('.closemenu').click(function () {
        $('.menu ul').hide();
    })
    $('.distim span').click(function () {
        $(this).parent().next().toggle()
    })
})