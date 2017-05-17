let model = (() => {

  // model
  // get data from JSON Server and pass it to a target function
  function getJson(fun, val) {
    $.getJSON( 'http://localhost:3000/elevator/1', data => { fun(data, val); } );
  }

  // save data in JSON Server
  function putJson(data) {
    $.ajax({
      url: 'http://localhost:3000/elevator/1',
      method: 'PUT',
      data: data,
      // contentType: 'application/json; charset=UTF-8',
      // TODO implement event emiter
      complete: () => { getJson(target.render); getJson(status.render); }
    });
  }

  // reveal functions
  return { getJson, putJson };

})();
