/* 
 *  @author N.Gárate
 *  created on 12.04.2017
 */

var arrayDataAut = [ ];
var arrayDataPro = [ ];
var arrayDataMun = [ ];

$(document).ready(inicio());

$('#aut' ).blur(
function()
{
    if ( $('#aut').is('[readonly="true"]') )
    {
        console.log('Autonomia ya selecionada');
    }
    else
    {
        var ok = false;
        for( var i in arrayDataAut ) 
        {
            var arr = arrayDataAut[i];
            if( $('#aut').val() === arr )
            {
                ok = true;
                break;
            }
            i++;
        }

        if(ok)
        {
            $.ajax(
            {
                url: "http://localhost:3000",
                type: 'post',
                dataType: 'json',
                data: { type: 'aut', data: $('#aut').val() },
                success: function( data, status )
                { 
                    console.log(status);
                    if(status === 'success')
                    {       
                        $('#pro').prop('disabled', false);
                    }
                    arrayDataPro = data;
                    $( "#aut" ).prop('readonly', true);
                    $( "#pro" ).autocomplete({ source: arrayDataPro });
                }
            });
        }
    }
});

$('#pro' ).blur(
function()
{
    if ( $('#pro').is('[readonly="true"]') )
    {
        console.log('Provincia ya selecionada');
    }
    else
    {

        var ok = false;
        for( var i in arrayDataPro ) 
        {
            var arr = arrayDataPro[i];
            if( $('#pro').val() === arr )
            {
                ok = true;
                break;
            }
            i++;
        }

        if(ok)
        {        
            $.ajax(
            {
                url: "http://localhost:3000",
                type: 'post',
                dataType: 'json',
                data: { type: 'pro', data: $('#pro').val() },
                success: function( data, status )
                { 
                    console.log(status);
                    if(status === 'success')
                    {       
                        $('#mun').prop('disabled', false);
                    }
                    arrayDataMun = data;
                    $( "#pro" ).prop('readonly', true);
                    $( "#mun" ).autocomplete({ source: arrayDataMun }); 
                }
            });
        }
    }
});

$('#divSub').hover(
function()
{
    if ( $('#mun').is('[readonly="true"]') )
    {
        console.log('Municipio ya selecionado');
    }
    else
    {
        var ok = false;
        for( var i in arrayDataMun ) 
        {
            var arr = arrayDataMun[i];
            if( $('#mun').val() === arr )
            {
                ok = true;
                break;
            }
            i++;
        }

        if(ok)
        {
            $( "#mun" ).prop('readonly', true);
            $('#sub').prop('disabled', false);
        }
    }
});

$("button[type='reset']").on("click", function()
{
    reset();
});

function inicio()
{
    $.ajax(
    {
        url: "http://localhost:3000",
        type: 'post',
        dataType: 'json',
        data: { type: "ini", data: 'none' },
        success: function( data, status )
        { 
            console.log(status);
            if(status === 'success')
            {       
                $('#aut').prop('disabled', false);
            }
            arrayDataAut = data;
            $( "#aut" ).autocomplete({ source: arrayDataAut });  
        }
    });	
}

function reset()
{
    arrayDataAut = [ ];
    arrayDataPro = [ ];
    arrayDataMun = [ ];
    
    $( "#aut" ).prop('readonly', false);
    $( "#pro" ).prop('readonly', false);
    $( "#mun" ).prop('readonly', false);
    
    $( "#aut" ).prop('disabled', true);
    $( "#pro" ).prop('disabled', true);
    $( "#mun" ).prop('disabled', true);
    
    $.ajax(
    {
        url: "http://localhost:3000",
        type: 'post',
        dataType: 'json',
        data: { type: "ini", data: 'none' },
        success: function( data, status )
        { 
            console.log(status);
            if(status === 'success')
            {       
                $('#aut').prop('disabled', false);
            }
            arrayDataAut = data;
            $( "#aut" ).autocomplete({ source: arrayDataAut });  
        }
    });	
}

