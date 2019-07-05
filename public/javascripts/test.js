console.log($);


$("#testButton").click(() => {
  $.ajax({
    method: "POST",
    url: "/testJquery",
    dataType: "json",
    data: {
      connectionCheck: "test string",
    },
      success: response => {
        $("#container").append(`<h3> ${response.result} </h3>`);
        console.log(`response: `, response);
      },
      error: error => {
        console.log(error);
      }
  });
});
