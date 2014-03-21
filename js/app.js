'use strict';

var App = (function App() {

  var newCallButton,
      newSmsButton,
      pickContactButton,
      pickPhotoButton,
      container;

  function init () {
    // Get the buttons and add a event listener for them
    newCallButton = document.getElementById('new-call');
    newSmsButton = document.getElementById('new-sms');
    pickContactButton = document.getElementById('pick-contact');
    pickPhotoButton = document.getElementById('pick-photo');

    container = document.getElementById('result');

    newCallButton.addEventListener('click', handleClick);
    newSmsButton.addEventListener('click', handleClick);
    pickContactButton.addEventListener('click', handleClick);
    pickPhotoButton.addEventListener('click', handleClick);
  }

  // Setups the actions for our buttons
  function handleClick(evt) {
    var button = evt.target.id;

    switch(button) {
      case 'new-call':
        newCall();
      break;
      case 'new-sms':
        newSMS();
      break;
      case 'pick-contact':
        pickContact();
      break;
      case 'pick-photo':
        pickPhoto();
      break;
      default:
        alert('No action');
    }
  }

  // New call
  function newCall() {
    var activity = new MozActivity({
      name: 'dial',
      data: {
        type: 'webtelephony/number',
        number: '12345678'
      }
    });

    activity.onsuccess = function() {
      // We don't do anything
    };

    activity.onerror = function() {
      alert('Unable to call');
    }
  };

  // New SMS
  function newSMS() {
    var activity = new MozActivity({
      name: 'new',
      data: {
        type: 'websms/sms',
        number: '12345678'
      }
    });

    activity.onsuccess = function() {
      // We don't do anything
    };

    activity.onerror = function() {
      alert('Unable to send SMS');
    }
  };

  // Pick contact
  function pickContact() {
    var activity = new MozActivity({
      name: 'pick',
      data: {
        type: 'webcontacts/tel'
      }
    });

    activity.onsuccess = function() {
      drawContact(this.result);
    };

    activity.onerror = function() {
      alert('Could not get a contact');
    };
  };

  // Pick photo
  function pickPhoto() {
    var activity = new MozActivity({
      name: 'pick',
      data: {
        type: 'image/png'
      }
    });

    activity.onsuccess = function() {
      drawImage(this.result.blob);
    };

    activity.onerror = function() {
      alert('Could not get an image');
    };
  };

  // Utility functions

  // Given a mozContact object, show it contents
  // in our app
  function drawContact(contact) {
    if (!contact) {
      return;
    }
    // Clean any current content
    container.innerHTML = '';

    // Append name
    var name = document.createElement('p');
    name.textContent = (contact.givenName || 'No name') +
                        ' ' + (contact.familyName || '');

    container.appendChild(name);

    // Append phone number
    var phone = document.createElement('p');
    phone.textContent = contact.tel[0].value;

    container.appendChild(phone);
  }

  // Given an image in blob format, render
  // it on our app
  // Warning: this is for testing purposes,
  //   removing and creating always the image
  //   is not the effective way.
  function drawImage(blob) {
    if (!blob) {
      return;
    }
    // Clean any current content
    container.innerHTML = '';

    // Build an image
    var img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    img.onload = function() {
      URL.revokeObjectURL(this.src);
    };
    container.appendChild(img);
  }

  return {
    init: init
  };

})();

window.onload = App.init;