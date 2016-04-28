'use strict';

function AddressBook() {
    this.knownKeys = ['firstName', 'lastName', 'street', 'city', 'state', 'phoneNumber'];

    this.addresses = [

  ];
}

AddressBook.prototype = {
    //create the next empty ID to be populated by the following contact
    newId: function () {
        if (this.addresses.length == 0) return 1;
        return (
            Math.max.apply(null, this.addresses.map(function (address) {
                return address.id;
            })) + 1
        );
    },
    //add a contact function
    addContact: function (contact) {
        contact.id = this.newId();
        this.addresses.push(contact);
    },
    //get a contact function
    getContact: function (id) {
        return this.addresses.find(function (contact) {
            return contact.id === id;
        });
    }


};

function AddressForm() {
    this.inputFieldIds = ['firstName', 'lastName', 'street', 'city', 'state', 'phoneNumber'];
}

AddressForm.prototype = {

    collectFormData: function () {
        var o = {};

        this.inputFieldIds.forEach(function (el) {
            o[el] = $('#' + el).val();
        });

        return o;
    },

    clearFormData: function () {
        this.inputFieldIds.forEach(function (el) {
            $('#' + el).val('');
        });
    },

    validateFormData: function (contact) {
        if (!contact.firstName || !contact.lastName) return false;
        return true;
    }

};

var addressBook = new AddressBook();
var addressForm = new AddressForm();

function prettifyFieldName(name) {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function (str) {
            return str.toUpperCase();
        });
}

function renderContacts(addressBook) {
    $('.contacts-list ul').empty();

    addressBook.addresses.forEach(function (contact) {
        $('.contacts-list ul').append(`<li><a href='#' class='show-contact' id='${contact.id}-show-contact'>${contact.firstName}</a></li>`);
    });
}

function createDetailHtml(addressBook, contact) {
    var html = '';
    addressBook.knownKeys.forEach(function (keyName) {
        if (contact[keyName]) html += `<strong>${prettifyFieldName(keyName)}:</strong> ${contact[keyName]}<br />`;
    });
    return html;
}

function renderDetail(addressBook, contact) {
    $('#contact-detail-info').html(createDetailHtml(addressBook, contact));
}

function sendFeedback(msg, fadeTime) {
    fadeTime = fadeTime || 2000;
    $('.feedback p').text(msg).fadeIn(1000, function () {
        setTimeout(function () {
            $('.feedback p').fadeOut(1000);
        }, fadeTime);
    });
}

$(function () {

    $('button#add-contact').click(function (e) {
        e.preventDefault();
        var contact = addressForm.collectFormData();

        // validation
        if (addressForm.validateFormData(contact)) {
            addressBook.addContact(contact);
            addressForm.clearFormData();
            renderContacts(addressBook);
        } else {
            sendFeedback("You must enter a first and last name.");
        }

    });

    $('.contacts-list').on('click', '.show-contact', function (e) {
        e.preventDefault();
        var contact = addressBook.getContact(parseInt(e.target.id));
        renderDetail(addressBook, contact);
    });

});
