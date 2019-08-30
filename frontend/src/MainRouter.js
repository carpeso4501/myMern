import React from "react";
import { Route } from "react-router-dom";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import FindPeople from "./user/FindPeople";
import NewPost from "./post/NewPost";
import EditPost from "./post/editPost";
import PrivateRoute from "./auth/PrivateRoute";
//Single post
import SinglePost from "./post/SinglePost";

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Route exact path="/" component={Home} />
      <PrivateRoute exact path="/posts/create" component={NewPost} />
      <Route exact path="/post/:postId" component={SinglePost} />
      <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
      <Route exact path="/users" component={Users} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signin" component={Signin} />
      <Route exact path="/user/:userId" component={Profile} />
      <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
      <PrivateRoute exact path="/findpeople" component={FindPeople} />
    </div>
  );
};

export default MainRouter;
