/* 
 *  @author N.Gárate
 *  created on 12.04.2017
 */
'use strict';

var dataSet = [ ];
var controlEstado = 0;

$(document).ready( inicio );

$( '#form' ).mousemove( select );

$( "button[type='reset']" ).click( reset );

$(".form-horizontal").submit(
function(e) 
{ 
    $.ajax(
    { 
        url: 'http://localhost:3000',
        type: "post",
        dataType: 'json',
        data: {type: "form", data: $("#mun").val()},
        success: function( data, status )
        { 
            console.log(status);
            if(status === 'success')
            {       
                console.log(data);
                $( "#sub" ).prop('disabled', true);
                alert('Gracias por tu participación');
            }
        }
    });
    e.preventDefault();
});

function select()
{
    switch( controlEstado )
    {
        case 1:
            aut();
            break;
        case 2:
            pro();
            break;
        case 3:
            mun();
            break;    
    }
}

function inicio()
{
    console.log( 'Peticion inical' );
    $.ajax(
    {
        url: "http://localhost:3000",
        type: 'post',
        dataType: 'json',
        data: { type: "ini", data: 'none' },
        success: function( data, status )
        { 
            console.log( 'Peticion inical: ' + status );
            $( '#aut' ).prop('disabled', false);
            dataSet = data;
            $( '#aut' ).autocomplete({ source: dataSet });
            controlEstado = 1;
        }
    });	
}

function aut()
{
    if ( $('#aut').is('[disabled="true"]') )
    {
        console.log('Autonomia ya selecionada');
    }
    else
    {        
        var inVal = $('#aut').val();
        var ok = match( inVal );

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
                    console.log( 'aut resp status: ' + status );
                    
                    $('#pro').prop('disabled', false);
                    dataSet = data;
                    $( '#aut' ).prop('disabled', true);
                    $( '#aut' ).parent().addClass('has-success');
                    
                    $( '#pro' ).autocomplete({ source: dataSet });
                    controlEstado = 2;
                }
            });
        }
    }
}

function pro()
{
    if ( $('#pro').is('[disabled="true"]') )
    {
        console.log('Provincia ya selecionada');
    }
    else
    {
        var inVal = $('#pro').val();
        var ok = match( inVal );

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
                    console.log( 'pro resp status: ' + status );
                    if(status === 'success')
                    {       
                        $('#mun').prop('disabled', false);
                    }
                    dataSet = data;
                    $( '#pro').prop('disabled', true);
                    $( '#pro' ).parent().addClass('has-success');
                    $( '#mun' ).autocomplete({ source: dataSet }); 
                    controlEstado = 3;
                }
            });
        }
    }
}

function mun()
{
    if ( $('#mun').is('[disabled="true"]') )
    {
        console.log('Municipio ya selecionado');
    }
    else
    {      
        var inVal = $('#mun').val();
        var ok = match( inVal );

        if(ok)
        {
            console.log( 'mun ok' );
            $( "#mun" ).prop('disabled', true);
            $( '#mun' ).parent().addClass('has-success');
            $( '#sub' ).prop('disabled', false);
            controlEstado = 4;
        }
    }
};

function reset()
{
    dataSet = [ ];
    
    $( "#aut" ).prop('disabled', true);
    $( "#pro" ).prop('disabled', true);
    $( "#mun" ).prop('disabled', true);
    
    $('#aut').parent().removeClass('has-success');
    $('#pro').parent().removeClass('has-success');
    $('#mun').parent().removeClass('has-success');

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
            dataSet = data;
            $( "#aut" ).autocomplete({ source: dataSet });
            controlEstado = 1;
        }
    });	
}

function match( inVal )
{
    var ok = false;
    for( var i in dataSet ) 
    {
        var arr = dataSet[i];
        if( inVal === arr )
        {
            ok = true;
            break;
        }
        i++;
    }
    return ok;
}