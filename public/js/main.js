/* 
 *  @author N.Gárate
 *  created on 12.04.2017
 */
'use strict';

var cache = { };
var uri = 'http://localhost:3000';

var cache = { };
$("#aut").autocomplete( autoSet( $("#aut").prop( 'id' ) ));
$("#pro").autocomplete( autoSet( $("#pro").prop( 'id' ) ));
$("#mun").autocomplete( autoSet( $("#mun").prop( 'id' ) ));


$( "#aut" ).on( "autocompletechange", autoChange );
$( "#pro" ).on( "autocompletechange", autoChange );
$( "#mun" ).on( "autocompletechange", autoChange );

var autoSet = function( id )
{
    var autoOpt = 
    {
        minLength: 2,
        source: 
            function ( request, response ) 
            {
                var term = request.term;
                request.type = id;
                console.log( request );
                if ( term in cache ) 
                {
                    response( cache[ term ] );
                    return;
                }

                $.post( uri, request, 
                    function( data, status, xhr ) 
                    {
                        cache[ term ] = data;
                        response( data );
                        console.log( 'aut autocomplete Status: ' + status );
                    }, 
                    'json'
                );
            }
    };
    return autoOpt;
};

var autoChange = function( event, ui ) 
{
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
};
/*

$(".form-horizontal").submit(
function(e) 
{ 
    $.ajax(
    { 
        url: uri,
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

*/