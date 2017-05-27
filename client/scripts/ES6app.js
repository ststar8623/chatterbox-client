class App {
  constructor() {
    this.friendList = {};
    this.roomList = {};
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  }
  init() {
    // setInterval(this.fetchMessage, 100);
    // $('#main').on('submit', 'send', function(e) {
    //   e.preventDefault();
    //   this.handleSubmit($(this).find('input#message').val());
    //   $('input#message').val('');
    //   this.fetchMessage();
    // });
    // $('#main').on('click', '.username', function() {
    //   this.addFriend($(this).text());
    // });
    // $('#main').on('change', '#roomSelect', function() {
    //   if ($(this).val() === 'createRoom') {
    //     $('#input-room-name').slideDown();
    //   } else {
    //     $('#input-room-name').slideUp();
    //   }
    // });
    // $('#main').on('keydown', '#input-room-name', function(e) {
    //   if (e.keyCode === 13) {
    //     var room = $(this).val();
    //     this.addRoom(room);
    //     $(this).val('');
    //     $('#roomSelect').val(room).trigger('change');
    //   }
    // });
    this.attachEventHandlers();
    this.fetchMessage();
  }
  attachEventHandlers() {
    $('#main').addEventListener('submit', '#send', this.submit.bind(this));
    $('#main').addEventListener('click', '.username', this.addFriends.bind(this));
    $('#main').addEventListener('change', '#roomSelect', this.roomChange.bind(this));
    $('#main').addEventListener('keydown', '#input-room-name', this.addRooms.bind(this));
  }
  submit(e) {
    e.preventDefault();
    this.handleSubmit($(this).find('input#message').val());
    $('input#message').val('');
    this.fetchMessage();
  }
  addRooms(e) {
    if (e.keyCode === 13) {
      var room = $(this).val();
      this.addRoom(room);
      $(this).val('');
      $('#roomSelect').val(room).trigger('change');
    }
  }
  addFriends() {
    this.addFriend($(this).text());
  }
  roomChange() {
    if ($(this).val() === 'createRoom') {
      $('#input-room-name').slideDown();
    } else {
      $('#input-room-name').slideUp();
    }
  }
  send() {
    $.ajax({
      url: this.server,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('message sent');
      },
      error: function(data) {
        console.log('failed sent');
      },
    });    
  }
  fetchMessage() {
    $.ajax({
      url: this.server,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        app.clearMessages();
        data.results.forEach(app.renderMessage);
      },
      error: function(data) {
        console.log('error message');
      }
    });
  }
  fetchRooms() {
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
  }
  clearMessages() {
    $('#chats').empty();
  }
  renderMessage(message) {
    let element = $('<div>');
    element.addClass('chat message');
    element.append($('<span class="username">').text(message.username));
    element.append($('<span class="text">').text(': ' + message.text));
    $('#chats').prepend(element);
  }
  renderRoom(roomName) {
    if (roomName && typeof this.roomList[roomName] === 'undefined') {
      roomName = roomName || 'lobby';
      let newRoom = $('<option>');
      newRoom.addClass('room');
      newRoom.attr('value', roomName);
      newRoom.text(roomName);
      $('#roomSelect').append(newRoom);
      this.roomList[roomName] = roomName;
    }
  }
  addFriend(name) {
    console.log('friend added');
    if (typeof this.friendList[name] === 'undefined') {
      this.friendList[name] = name;
    } else {
      delete this.friendList[name];
    }
  }
  handleSubmit(messageText) {
    let message = {};
    message.username = window.location.search.replace('?username=', '');
    message.text = messageText.text;
    message.roomname = $('#roomText').val();
    this.send(message);
  }
  // submit(e) {
  //   e.preventDefault();
  //   this.handleSubmit($(this).find('input#message').val());
  //   $('input#message').val('');
  //   this.fetchMessage();
  // }
}

var app = new App();
$('document').ready(function() {
  app.init();
});





