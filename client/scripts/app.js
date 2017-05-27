// YOUR CODE HERE:
var friendList = {};
var roomList = {};
var app = {
  init: function() {
    // send message
    $('#main').on('submit', '#send', function(e) {
      e.preventDefault();
      app.handleSubmit($(this).find('input#message').val());
      $('input#message').val('');
    });
    // add friend 'highlight name'
    $('#chats').on('click', '.username', function() {
      app.addFriend($(this).text());
      // if friend is already added
      if ($(this).hasClass('friend')) {
        // remove friend's highlight
        $(this).removeClass('friend');
      } else {
        // if not add friend's highlight
        $(this).addClass('friend');
      }
    });
    // animation for add room input
    $('#main').on('change', '#roomSelect', function() {
      if ($(this).val() === 'createRoom') {
        $('#input-room-name').slideDown();
      } else {
        $('#input-room-name').slideUp();
      }
    });
    // close input box after clicking 'enter key'
    $('#main').on('keydown', '#input-room-name', function(e) {
      if (e.keyCode === 13) {
        var room = $(this).val();
        // render room
        app.renderRoom(room);
        $(this).val('');
        // trigger change function for animation
        $('#roomSelect').val(room).trigger('change');
      }
    });
    app.fetchRooms();
    app.fetch();

    // // load pages every 1/10 of a sec
    // setInterval(app.fetch, 100);
    // // load rooms every 1 sec
    // setInterval(app.fetchRoom, 1000);
  },
  send: function(message) {
    $.ajax({
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('Message sent');
      },
      error: function() {
        console.log('error send');
      }
    });
  },
  // fetch every 1/10 of a sec
  fetch: function() {
    $.ajax({
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        // clear all messages before fetching new one
        app.clearMessages();
        data.results.forEach(app.renderMessage);
      },
      error: function() {
        console.log('error loading');
      }
    });
  },
  // fetch every sec
  fetchRooms: function() {
    $.ajax({
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        data.results.forEach(function(e) {
          app.renderRoom(e.roomname);
        });
      },
      error: function(data) {
        console.log('failed to add rooms');
      }
    });
  },
  clearMessages: function() {
    // clear chats
    $('#chats').empty();
  },
  renderMessage: function(message) {
    // create html
    let newMsg = $('<div class="chat">');
    newMsg.addClass('message');
    newMsg.append($('<span class="username">').text(message.username));
    newMsg.append($('<span class="text">').text(': ' + message.text));
    $('#chats').prepend(newMsg);
  },
  // submit message
  handleSubmit: function(messageText) {
    // create obj
    let message = {};
    // get name from prompt
    message.username = window.location.search.replace('?username=', '');
    message.text = messageText;
    message.roomname = $('#roomSelect').val();
    app.send(message);
  },
  // working
  renderRoom: function(roomName) {
    if (roomName && typeof roomList[roomName] === 'undefined') {
      roomName = roomName || 'lobby';
      let newRoom = $('<option>');
      newRoom.addClass('room');
      newRoom.attr('value', roomName);
      newRoom.text(roomName);
      $('#roomSelect').append(newRoom);
      roomList[roomName] = roomName;
    }
  },
  // working
  addFriend: function(name) {
    console.log('friend added ', name);
    if (typeof friendList[name] === 'undefined') {
      friendList[name] = name;
    } else {
      delete friendList[name];
    }
    console.log(friendList);
  },
};
// saved server url
app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

$('document').ready(function() {
  app.init();
});


