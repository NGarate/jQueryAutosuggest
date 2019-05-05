/*
 *  @author N.Gárate
 *  created on 12.04.2017
 *  last updated on 04/05/2019
 */
const allInputsIds = ["aut", "pro", "mun"];

$(document).ready(function() {
	getAutInfoToAutocomplete();

	addSubmitEvent("form-form", event => {
		event.preventDefault();
		const data = {
			aut: $("#aut").val(),
			pro: $("#pro").val(),
			mun: $("#mun").val()
		};
		$.ajax({
			url: "/final",
			type: "post",
			dataType: "json",
			data,
			success: showSuccessAlert,
			error: showErrorAlert
		});
	});
});

function getAutInfoToAutocomplete() {
	$.ajax({
		url: "/aut",
		type: "get",
		dataType: "json",
		success: addAutocomplete("aut")
	});
}

function showSuccessAlert() {
	const alert = `<div class="alert alert-success alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">
            &times;
        </a>
        <strong>¡Gracias!</strong>
        <p>
            ${$("#aut").val()} -> ${$("#pro").val()} -> ${$("#mun").val()}
        </p>
    </div>`;
	$("#add-alerts").append(alert);
}

function showErrorAlert() {
	const alert = `<div class="alert alert-warning alert-dismissible">
            <a href="#" class="close" data-dismiss="alert" aria-label="close">
                &times;
            </a>
        <strong>¡Error!</strong>
        <p> El municipio no existe, selecciona otro municipio </p>
    </div>`;
	$("#add-alerts").append(alert);
}

function addSubmitEvent(id, action) {
	$(`#${id}`).submit(action);
}

$("#aut").on("input", function() {
	$("#pro").val("");
	$("#mun").val("");
	checkInput($(this));
});

$("#pro").on("input", function() {
	$("#mun").val("");
	checkInput($(this));
});

$("#mun").on("input", function() {
	checkInput($(this));
});

function checkInput(input) {
	const id = input.attr("id");
	input.removeClass("input-success");

	if (isValueValid(input)) {
		input.addClass("input-success");
		$.ajax({
			url: `/${getNextId(id)}`,
			type: "get",
			dataType: "json",
			success: addAutocomplete(getNextId(id))
		});
	}
}

function addAutocomplete(id) {
	return data => $(id).autocomplete({ source: data });
}

function isValueValid(loc) {
	const source = loc.autocomplete("option", "source");
	return source.some(e => e == loc.val());
}

function getNextId(id) {
	const actualId = allInputsIds.findIndex(i => i == id);
	const nextId = actualId + 1;
	return allInputsIds[nextId];
}
