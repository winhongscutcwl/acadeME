/**
 * @jsx React.DOM
 */
'use strict';

var React              = require('react/addons');
var Reflux             = require('reflux');
var ActiveState        = require('react-router').ActiveState;

var UserActions        = require('./actions/UserActions');
var CurrentUserStore   = require('./stores/CurrentUserStore');
var CurrentCourseStore = require('./stores/CurrentCourseStore');
var Header             = require('./components/Header');
var Sidebar            = require('./components/Sidebar');
var Footer             = require('./components/Footer');

var App = React.createClass({

  mixins: [ActiveState, Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      currentUser: {},
      course: {}
    };
  },

  _onUserChange: function(err, user) {
    if ( err ) {
      // handle error
    } else {
      this.setState({ currentUser: user });
    }
  },

  _onCourseChange: function(err, course) {
    if ( err ) {
      // TODO: handle error
    } else {
      this.setState({ currentCourse: course });
    }
  },

  componentWillReceiveProps: function() {
    if ( !this.isActive('Course') ) {
      this._onCourseChange({});
    }
  },

  componentDidMount: function() {
    UserActions.check(this._onUserChange);
    this.listenTo(CurrentUserStore, this._onUserChange);
    this.listenTo(CurrentCourseStore, this._onCourseChange);
  },

  updatePageTitle: function(title) {
    var newPageTitle = '';

    if ( title ) {
      newPageTitle += title;
      newPageTitle += ' \u2014 ';
    }

    newPageTitle += 'App Name';

    document.title = newPageTitle;
  },

  render: function() {
    return (
      <div>

        <Header />

        <div className="body-container">
          <Sidebar course={this.state.currentCourse} />
          <div className="content-container">
            <this.props.activeRouteHandler currentUser={this.state.currentUser}
                                           updatePageTitle={this.updatePageTitle}
                                           course={this.state.currentCourse} />
          </div>
        </div>

        <Footer />

      </div>
    );
  }

});

module.exports = React.createFactory(App);