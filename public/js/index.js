"use strict";

function taskToDOMElement(task) {
    let h2 = $("<h2></h2>");
    h2.text(task.text);
    let button = $("<button></button>");
    button.text("Eliminar");
    button.addClass("deleteButton");
    let element = $("<li></li>");
    element.addClass("task");
    element.attr("id", task.id);
    element.append(h2);
    element.append(button);
    return element;
}

function loadTasks() {
    $.ajax({
        method: "GET",
        url: "/tasks",
        success: function (data, textStatus, jqXHR) {
            data.forEach(element => {
                let task = taskToDOMElement(element);
                $(".task-list").append(task);
            });
        },
        // En caso de error, mostrar el error producido
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });

}

function onRemoveButtonClick(event) {
    $.ajax({
        method: "DELETE",
        url: "/tasks/" + $(event.target).parent().attr("id"),
        success: function (data, textStatus, jqXHR) {
            let id = $(event.target).parent().attr("id");
            $("#" + id).remove();
        },
        // En caso de error, mostrar el error producido
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
}

function onAddButtonClick(event) {
    let valor = $("form>input[type='text']").val();
    if (valor != "" && valor.length < 30) {
        let new_task = {
            text: valor
        };
        $.ajax({
            method: "POST",
            url: "/addTask",
            contentType: "application/json",
            data: JSON.stringify(new_task),
            success: function (data, textStatus, jqXHR) {
                let task = taskToDOMElement(data);
                $(".task-list").append(task);
            },
            // En caso de error, mostrar el error producido
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Se ha producido un error: " + errorThrown);
            }
        });
    } else {
        alert("La longitud no es la correcta");
    }
}
$(() => {
    loadTasks();
    $(".task-list").on("click", ".task>.deleteButton", (event) => {
        onRemoveButtonClick(event);
    });
    $(".add-button").on("click", (event) => {
        onAddButtonClick(event);
    });

    // remove enter key effect
    $(document).on("keypress", "form", (event) => { 
        return event.keyCode != 13;
    });
});