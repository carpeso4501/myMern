import React, { Component } from "react";
import { follow, unfollow } from "./apiUser";

class FollowProfileButton extends Component {
  followClick = () => {
    this.props.onButtonCLick(follow);
  };

  unfollowClick = () => {
    this.props.onButtonCLick(unfollow);
  };

  render() {
    return (
      <div className="d-inline-block">
        {!this.props.following ? (
          <button
            onClick={this.followClick}
            className="btn btn-success btn-raised mr-5"
          >
            Follow
          </button>
        ) : (
          <button
            onClick={this.unfollowClick}
            className="btn btn-warning btn-raised mr-5"
          >
            UnFollow
          </button>
        )}
      </div>
    );
  }
}

export default FollowProfileButton;
