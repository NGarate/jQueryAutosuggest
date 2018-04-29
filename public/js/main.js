/*
*  @author N.Gárate
*  created on 12.04.2017
*  update on 16/06/2017
*  update on 27/04/2018
*/
'use strict';

const uri = window.location.href + 'search';

let arrayDataAut = [];
let arrayDataPro = [];
let arrayDataMun = [];

$(document).ready(function () {
    $.ajax(
        {
            url: uri,
            type: 'post',
            dataType: 'json',
            data: {type: 'ini', data: 'none'},
            success: function (data, status) {
                console.log(status);
                if (status === 'success') {
                    arrayDataAut = data;
                    $("#aut").autocomplete({source: arrayDataAut});
                }
            }
        });
    $("#form-form").submit(
        function (event) {
            const data = {'aut': $('#aut').val(), 'pro': $('#pro').val(), 'mun': $('#mun').val()};
            event.preventDefault();
            $.ajax(
                {
                    url: window.location.href + "final",
                    type: 'post',
                    dataType: 'json',
                    data: {type: 'complete', data: data},
                    success: function (data, status) {
                        if (status === 'success') {
                            let alerta = '<div class="alert alert-success alert-dismissible">' +
                                '   <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
                                '   <strong>¡Gracias!</strong> <p>' + $('#aut').val() + ' -> ' + $('#pro').val() + ' -> ' + $('#mun').val() + '</p>' +
                                '</div>';
                            $("#add-alerts").append(alerta);
                        }
                    }
                });
        }
    );

});

$('#aut').on('input', function () {
    const mun = $("#mun");
    const pro = $("#pro");
    pro.val('');
    arrayDataPro = [];
    pro.autocomplete({source: arrayDataPro});
    mun.val('');
    arrayDataMun = [];
    mun.autocomplete({source: arrayDataMun});
    revisaSiCorrecto($(this));
});

$('#pro').on('input', function () {
    const mun = $("#mun");
    mun.val('');
    arrayDataMun = [];
    mun.autocomplete({source: arrayDataMun});
    revisaSiCorrecto($(this));
});

$("input").focusout(function () {
    revisaSiCorrecto($(this));
});

let revisaSiCorrecto = function (input) {
    const aut = $('#aut');
    aut.removeClass("input-success");
    const pro = $('#pro');
    pro.removeClass("input-success");
    const mun = $('#mun');
    mun.removeClass("input-success");

    for (let key in arrayDataAut) {
        if (arrayDataAut[key] === aut.val() && aut.val() !== '') {
            aut.addClass("input-success");
            if (input.prop('id') === 'aut') {
                solicitaProvincia();
            }
        }
    }

    for (let key in arrayDataPro) {
        if (arrayDataPro[key] === pro.val() && pro.val() !== '') {
            pro.addClass("input-success");
            if (input.prop('id') === 'pro') {
                solicitaMunicipio();
            }
        }
    }

    for (let key in arrayDataMun) {
        if (arrayDataMun[key] === mun.val() && mun.val() !== '') {
            mun.addClass("input-success");
        }
    }
};

let solicitaProvincia = function () {
    $.ajax(
        {
            url: uri,
            type: 'post',
            dataType: 'json',
            data: {type: 'aut', data: $('#aut').val()},
            success: function (data, status) {
                if (status === 'success') {
                    console.log("Provincias de: " + $('#aut').val() + " ||| recibidas: " + data);
                    arrayDataPro = data;

                    $("#pro").autocomplete({source: arrayDataPro});
                }
            }
        });
};

let solicitaMunicipio = function () {
    $.ajax(
        {
            url: uri,
            type: 'post',
            dataType: 'json',
            data: {type: 'pro', data: $('#pro').val()},
            success: function (data, status) {
                if (status === 'success') {
                    console.log("Municipios recibidas");
                    arrayDataMun = data;
                    $("#mun").autocomplete({source: arrayDataMun});
                }
            }
        });
};

window.onload = function () {
    setTimeout(function () {
        window.performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {};
        let t = performance.timing || {};

        if (!t) {
            return;
        }
        let start = t.navigationStart,
            end = t.loadEventEnd;
        let loadTime = (end - start) / 1000;

        $("#loadTime").html(loadTime + " segundos");
    }, 0);
};

