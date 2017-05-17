let status = (() => {

  // cache DOM
  const $status = $('#statusModule');
  const template = $('#status-template').html();

  // init
  model.getJson(_initData);
  model.getJson(render); // `getJson(function)`

  // actions
  // render the mustache template
  function render(data) {
    // https://github.com/janl/mustache.js#usage
    $status.html(Mustache.render(template, data));
  }

  // initialize the elevator state on page load
  function _initData(data) {
    data.going = 'Elevator is here',
    data.currentFloor = '0'
    data.targetQueue = '',
    data.target = '0',
    data.isMoving = 'false',
    data.key = 'false',
    data.callerFloor = '-1',
    model.putJson(data);
  }

  // `getStatusText` is called by `target.js`
  function getStatusText(target, current) {
    if (target > current) {
      return 'Up';
    } else if (target < current) {
      return 'Down';
    }
  }

  // reveal functions
  return { render, getStatusText };

})();
