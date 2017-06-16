/* 
 *  @author N.Gárate
 *  created on 12.04.2017
 *. change on 16/06/2017
 */
'use strict';

var arrayDataAut = [ ];
var arrayDataPro = [ ];
var arrayDataMun = [ ];

$(document).ready(inicio());


$("#aut option:selected").text.change("function()
{
	if($('#aut').val() !== "")
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
	                arrayDataPro = data;
	                $( "#pro" ).autocomplete({ source: arrayDataPro });
	                arrayDataMun = [ ];
	            }
	        }
	    });
	}
});

        
$("#pro option:selected").text.change("function()
{
	if($('#pro').val() !== "")
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
	                arrayDataMun = data;
	                $( "#mun" ).autocomplete({ source: arrayDataMun });
	            }
	        }
	    });
	}
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
                arrayDataAut = data;
                $( "#aut" ).autocomplete({ source: arrayDataAut });  
            }
        }
    });	
}

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
                alert('Gracias por tu participación');
            }
        }
    });
    e.preventDefault();
});
