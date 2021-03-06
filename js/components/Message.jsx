'use strict';

var React                = require('react/addons');
var cx                   = React.addons.classSet;

var AttachmentModalMixin = require('../mixins/AttachmentModalMixin.jsx');
var UserAvatar           = require('./UserAvatar.jsx');

var Message = React.createClass({

  mixins: [AttachmentModalMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    currentRecipient: React.PropTypes.object.isRequired,
    message: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      currentRecipient: {},
      message: {}
    };
  },

  getMessageUser: function() {
    if ( this.props.message.userId === this.props.currentUser.id ) {
      return this.props.currentUser;
    } else if ( this.props.message.userId === this.props.currentRecipient.id ) {
      return this.props.currentRecipient;
    }
  },

  didUserSend: function() {
    return this.props.message.userId === this.props.currentUser.id;
  },

  handleAttachmentClick: function(evt) {
    var annotatableRegex = new RegExp('\.(pdf|png|jpg|jpeg|gif|bmp)', 'i');

    // Only show modal if it is an annotatable attachment,
    // otherwise continue on to the link
    if ( annotatableRegex.test(this.props.message.attachment.name) ) {
      evt.preventDefault();
      evt.stopPropagation();
      this.showAttachmentModal(this.props.message.attachment);
    }
  },

  renderMessageAttachment: function() {
    var classes = cx({
      'text-right': true,
      'nudge-quarter--top': this.props.message.body && this.props.message.body.length
    });

    if ( this.props.message.attachment ) {
      return (
        <div className={classes}>
          <a onClick={this.handleAttachmentClick} href={this.props.message.attachment.url} target="_blank">
            {this.props.message.attachment.name}
          </a>
          <i className="fa fa-paperclip nudge-quarter--left" />
        </div>
      );
    }
  },

  render: function() {
    var classes = 'message' + (this.didUserSend() ? ' user-sent' : '');
    return (
      <li className={classes}>
        <div className="user-container">
          <UserAvatar user={this.getMessageUser()} />
        </div>
        <div className="body-container">
          <div className="body">
            {this.props.message.body}
            {this.renderMessageAttachment()}
          </div>
        </div>
      </li>
    );
  }

});

module.exports = Message;
