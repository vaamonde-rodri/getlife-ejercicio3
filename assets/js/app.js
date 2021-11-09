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
        submitHandler: function (form) {
            //convertimos formato de fechas, de "DD/MM/YYYY hh:mm" a "YYYY-MM-DD hh:mm:ss"
             const initDate = convertDate($("input[name='initDate']", form).val());
             const endDate = convertDate($("input[name='endDate']", form).val());

             if (moment(initDate, "YYYY-MM-DD hh:mm:ss").isValid() && moment(endDate, "YYYY-MM-DD hh:mm:ss").isValid()) {

                 const url = API_URL + "?initDate=" + initDate + "&endDate=" + endDate;

                 fetch(url).then(response => response.json())
                     .then(data => {
                         console.log(typeof data.result);
                         console.log(data.result && typeof data.result === "array")
                         if (data.result && typeof data.result === "object") {
                             const string = data.result.join(', ');
                             $("div#alertResult > span#data").html(string);
                             $("div#alertResult").fadeIn();
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