let target = (() => {

  // cache DOM
  const $document = $(document);
  const $target = $('#targetModule');
  const template = $('#target-template').html();

  // bind events on future elements
  $document.on('click', '.btn-danger', () => { model.getJson(_keyMode) });
  $document.on('click', '.btn-secondary', function() { // NOTE arrow functions doesn't bind `this`
    model.getJson(goToFloor, $(this).val());
  });

  // init
  model.getJson(render);

  // actions
  // render the mustache template
  function render(data) {
    // https://github.com/janl/mustache.js#usage
    $target.html(Mustache.render(template, data));
  }

  // convert a string in to an array
  function _stringToArr(str) {
    let arr = str.split(',');
    arr = jQuery.grep(arr, newArr => {
      return newArr !== '';
    });
    return arr;
    // NOTE Remember to convert the array in to a string with `arr.toString()`
    // before storing the data back in the database.
  }

  // toggle the special janitor mode
  function _keyMode(data) {
    if (data.key === 'false' && data.targetQueue === '') {
      data.key = 'true';
      call.hideCall();
      model.putJson(data);
    } else {
      data.key = 'false';
      call.displayCall();
      model.putJson(data);
    }
  }

  // Compare `currentFloor` with the array and get the closest floor.
  // Here is where the route of the elevator is optimized.
  function _sortFloorQueue(queue, currentFloor) {
    if (queue.length !== 0) {
      let closest = queue.reduce((prev, curr) => {
        return (Math.abs(curr - currentFloor) < Math.abs(prev - currentFloor) ? curr : prev);
      });
      queue.splice(queue.indexOf(closest), 1);
      queue.splice(0, 0, closest);
      // filter out repeated values
      queue = queue.filter((elem, index, self) => {
        return index === self.indexOf(elem);
      });
    }
    return queue;
  }

  function goToFloor(data, val) {
    console.log('%c `goToFloor()` ', 'background: #222; color: #bada55');

    // check if janitor mode is `true` and handle the request
    if (data.key === 'true') {

      if (data.targetQueue === '') {

        data.targetQueue = val;
        data.target = val;
        // get the elevator status text from the status module
        data.going = status.getStatusText(data.target, data.currentFloor);
        data.isMoving = 'true';
        model.putJson(data);
        // `setTimeout` simulates the time between floors
        setTimeout(() => { model.getJson(moveElevator) }, 3000);

      }

      // handle the button requests when janitor mode is `false`
    } else {

      let queue = _stringToArr(data.targetQueue);
      // compare the boolean string
      let repeatedFloor = (data.isMoving === 'true') ? queue[queue.length - 1] : data.currentFloor;
      data.target = val;

      console.log('`repeatedFloor` type: ' + typeof repeatedFloor + ', val: ' + repeatedFloor);
      console.log('`data.target` type: ' + typeof data.target + ', val: ' + data.target);

      // When the user presses a button and it isn't the same as the last pressed
      // button the request is handled. This measure is to prevent "floor spamming".
      if (data.target !== repeatedFloor) {

        queue.push(data.target); // push the last request to the floor queue
        data.targetQueue = queue.toString();
        model.putJson(data);
        console.log(queue);

        // If the elevator isn't moving means that it's the first request from
        // a static state. This request is handled here and passed to `moveElevator`.
        if (data.isMoving === 'false') {

          data.going = status.getStatusText(data.target, data.currentFloor);
          data.isMoving = 'true';
          model.putJson(data);
  	      setTimeout(() => { model.getJson(moveElevator) }, 3000);

        }
      }
    }
  }

  // move the elevator from one floor to another
  function moveElevator(data) {
    console.log('%c `moveElevator()` ', 'background: #222; color: #bada55');
    let queue = _stringToArr(data.targetQueue);
    // queue.length === 0 ? queue : queue = _sortFloorQueue(queue, data.currentFloor);
    queue = _sortFloorQueue(queue, data.currentFloor);

    // the elevator changes the floor and works off the "floor queue" with `shift`
    console.log('`currentFloor`: ' + data.currentFloor);
    console.log(queue);
    data.currentFloor = queue.shift(); // NOTE magic happening!
    console.error(" Moved to floor: " + data.currentFloor);

    // If the `queue` array isn't empty `moveElevator` is called back with fresh
    // JSON Server data until the `queue` is empty.
    if (queue[0] !== undefined) {

      data.going = status.getStatusText(queue[0], data.currentFloor);
      data.targetQueue = queue.toString();
      model.putJson(data);
      setTimeout(() => {  model.getJson(moveElevator); }, 3000);

      // If the `queue` is empty we save the static state of the elevator back
      // in the JSON Server. Now the elevator is ready again to handle the janitor
      // mode or start moving again.
    } else {

      data.isMoving = 'false';
      data.going = 'Elevator is here';
      data.target = data.currentFloor;
      queue = [];
      data.targetQueue = queue.toString();
      model.putJson(data);

    }
  }

  // reveal functions
  return { render, goToFloor };

})();
