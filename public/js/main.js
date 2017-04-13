/* 
 *  @author N.Gárate
 *  created on 12.04.2017
 */

$( function() 
{
    $( "#aut" ).autocomplete({ source: aut });  
    $( "#pro" ).autocomplete({ source: pro }); 
    $( "#mun" ).autocomplete({ source: mun }); 
});


