$(function () {
    const API_URL = "https://127.0.0.1:8000/api/fibonacci";

    $("#initDate, #endDate").inputmask({
        mask: '99/99/9999 99:99'
    });

    const formDates = $("#formDates");
    formDates.on("submit", function (e) {
        e.preventDefault();
    });

    function showError(msg) {
        $("div#alertError").text(msg).fadeIn();
        setTimeout(function () {
            $("div#alertError").fadeOut();
        }, 3000);
    }
    function showWarning(msg) {
        $("div#alertWarning").text(msg).fadeIn();
        setTimeout(function () {
            $("div#alertWarning").fadeOut();
        }, 3000);
    }

    formDates.validate({
        lang: 'es',
        rules: {
            initDate: {
                required: true
            },
            endDate: {
                required: true
            },
        },
        messages: {
            initDate: {
                required: "Es necesario indicar una fecha inicial"
            },
            endDate: {
                required: "Es necesario indicar una fecha final"
            }
        },
        submitHandler: async function (form) {
            //convertimos formato de fechas, de "DD/MM/YYYY hh:mm" a "YYYY-MM-DD hh:mm:ss"
             const initDate = convertDate($("input[name='initDate']", form).val());
             const endDate = convertDate($("input[name='endDate']", form).val());

             if (moment(initDate, "YYYY-MM-DD hh:mm:ss").isValid() && moment(endDate, "YYYY-MM-DD hh:mm:ss").isValid()) {

                 const url = API_URL + "?initDate=" + initDate + "&endDate=" + endDate;

                 if ($(".alert").is(":visible")) {
                     $(".alert").fadeOut();
                     //Detenemos la ejecución durante 1 segundo para darle tiempo al fadeout
                     await new Promise(resolve => setTimeout(resolve, 1000));
                 }

                 fetch(url).then(response => response.json())
                     .then(data => {
                         if (data.result && typeof data.result === "object") {
                             if (data.result.length > 0) {
                                 const string = data.result.join(', ');
                                 $("div#alertResult > span#data").html(string);
                                 $("div#alertResult").fadeIn();
                             } else {
                                 showWarning("No se han encontrado números de la sucesión de Fibonacci entre las fechas indicadas")
                             }
                         } else {
                             showError("Ha ocurrido un error al manejar los datos")
                         }
                     })
                     .catch(error => {
                         showError(error);
                     });
             } else {
                 showError("Alguna de las fechas tiene formato incorrecto");
             }
        }
    });


    function convertDate(stringDate) {
        dateTime = stringDate.split(" ");
        partsDate = dateTime[0].split("/");

        return partsDate[2] + "-" + partsDate[1] + "-" + partsDate[0] + " " + dateTime[1] + ":00";
    }
});

//
//
//
// const url = API_URL + "?initDate=1993-01-12 23:33:12&endDate=2216-07-01 17:40:50";
//
// fetch(url).then(response => response.json())
//     .then(data => {
//         console.log(data)
//     })
//     .catch(error => console.log(error));