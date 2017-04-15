/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


			
$(document).ready(
function()
{
    $.post("localhost:3000", 
    function(data)
    {
        switch(data.type)
        {
            case 'aut':
                $('aut').prop('disabled', false);
                break;
            case 'pro':
                $('pro').prop('disabled', false);
                break;
            case 'mun':
                $('mun').prop('disabled', false);
                break;
            default:
                break;    
        }
    });     	
});





