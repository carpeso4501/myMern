import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar2.png";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      about: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
          error: ""
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({ error: "File size should be less then 100kb" });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is Required!", loading: false });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "Invalid email!", loading: false });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize: fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    if (this.isValid()) {
      this.setState({ loading: true });
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then(data => {
        if (data.error) this.setState({ error: data.error });
        else
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
      });
    }
  };

  signupForm = (name, email, about) => (
    <form action="">
      <div className="form-group">
        <label htmlFor="name" className="text-muted">
          Profile Photo
        </label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="name" className="text-muted">
          Name
        </label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="text-muted">
          Email
        </label>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>

      <div className="form-group">
        <label htmlFor="about" className="text-muted">
          About
        </label>
        <input
          onChange={this.handleChange("about")}
          type="text"
          className="form-control"
          value={about}
        />
      </div>

      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update
      </button>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      redirectToProfile,
      error,
      loading,
      about
    } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            {" "}
            <h2>Loading...</h2>{" "}
          </div>
        ) : (
          ""
        )}

        <img src={photoUrl} alt={name} className="col-3 img-thumbnail" />

        {this.signupForm(name, email, about)}
      </div>
    );
  }
}

export default EditProfile;
