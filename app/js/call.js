let call = (() => {

  // cache DOM
  const $call = $('#callModule');
  const $button = $call.find('button');
  const $select = $call.find('select');

  // bind events
  $select.on('change', e => { model.getJson(_setCallerFloor) });
  $button.on('click', e => { model.getJson(target.goToFloor, $select.val()); });

  // actions
  // save the floor from wich the elevator is called in JSON Server
  function _setCallerFloor(data) {
    data.callerFloor = $select.val(); // `$('#floorSelect').val()`
    model.putJson(data);
  }

  // show the call module
  function displayCall() {
    $call.css('display', 'block');
  }

  // hide the call module
  function hideCall() {
    $call.css('display', 'none');
  }

  // reveal functions
  return { displayCall, hideCall };

})();
