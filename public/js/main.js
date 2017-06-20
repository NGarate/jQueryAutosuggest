*
*  @author N.Gárate
*  created on 12.04.2017
*. change on 16/06/2017
*/
'use strict';

var cache = { };
var uri = 'http://192.168.100.78:3000/search';

var cache = { };
var arrayDataAut = [ ];
var arrayDataPro = [ ];
var arrayDataMun = [ ];

$( document ).ready(function()
{
    $.ajax(
    {
        url: uri,
        type: 'post',
        dataType: 'json',
        data: { type: 'ini', data: 'none' },
        success: function( data, status )
        {
            console.log(status);
            if(status === 'success')
            {
                arrayDataAut = data;
                $( "#aut" ).autocomplete({ source: arrayDataAut });
            }
        }
    });

})

$('#aut').on('input', function()
{
    $( "#pro" ).val('')
    arrayDataPro = [ ];
	$( "#pro" ).autocomplete({ source: arrayDataPro });
    $( "#mun" ).val('')
	arrayDataMun = [ ];
	$( "#mun" ).autocomplete({ source: arrayDataMun });
	revisaSiCorrecto();
});

$('#pro').on('input', function()
{
    $( "#mun" ).val('')
	arrayDataMun = [ ];
	$( "#mun" ).autocomplete({ source: arrayDataMun });
	revisaSiCorrecto();
});

$("input").focusout(function(event)
{
	revisaSiCorrecto();
});

var revisaSiCorrecto = function()
{
	if (arrayDataPro.length === 0 && arrayDataMun.length === 0 )
	{
		for (var key in arrayDataAut)
		{
			if (arrayDataAut[key] === $('#aut').val() )
			{
				solicitaProvincia();
				break;
			}
		}
	}

	if (arrayDataMun.length === 0 )
	{
		for (var key in arrayDataPro)
		{
			if (arrayDataPro[key] === $('#pro').val() )
			{
				solicitaMunicipio();
				break;
			}
		}
	}
};

var solicitaProvincia = function()
{
	$.ajax(
	{
		url: uri,
		type: 'post',
		dataType: 'json',
		data: { type: 'aut', data: $('#aut').val() },
		success: function( data, status )
		{
			if(status === 'success')
			{
                console.log("Provincias de: " + $('#aut').val() + " ||| recibidas: " + data);
				arrayDataPro = data;

				$( "#pro" ).autocomplete({ source: arrayDataPro });
			}
		}
	});
}

var solicitaMunicipio = function()
{
	$.ajax(
	{
		url: uri,
		type: 'post',
		dataType: 'json',
		data: { type: 'pro', data: $('#pro').val() },
		success: function( data, status )
		{
			if(status === 'success')
			{
                console.log("Municipios recibidas");
				arrayDataMun = data;
				$( "#mun" ).autocomplete({ source: arrayDataMun });
			}
		}
	});
};

/*
var sendData = { term: $(this).val(), type: $(this).prop( 'id' )+'IsOk' } ;
$.post( uri, sendData,
    function( data, status, xhr )
    {
        console.log( status );
        if( data === true )
        {
            this.parent().addClass( 'has-success');
        }
        else
        {
            this.parent().addClass( 'has-error');
        }
    },
    'json'
);
*/

