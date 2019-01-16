import React, { Component } from "react";
import Saved from "./Saved";
import Search from "./Search";
import Results from "./Results";
import API from "../utils/api";

class Main extends Component {

  state = {
    topic: "",
    startYear: "",
    endYear: "",
    articles: [],
    saved: []
  };

  // When the component mounts, get a list of all saved(favorited) articles and update this.state.saved
  componentDidMount() {
    this.getFavoritedArticles()
  }

  // Method for getting saved articles (all articles) from the db
  getFavoritedArticles = () => {
    API.getArticle()
      .then((res) => {
        this.setState({ saved: res.data });
      });
  }

  // A helper method for rendering one search results div for each article
  createArticleCards = () => {
    return this.state.articles.slice(0, 5).map(article => (
      <Results
        _id={article._id}
        key={article._id}
        title={article.headline.main}
        date={article.pub_date}
        url={article.web_url}
        handleFavoriteButton={this.handleFavoriteButton}
        getFavoritedArticles={this.getFavoritedArticles}
      />
    ));
  }

  // A helper method for rendering one div for each saved article
  showFavorited = () => {
    return this.state.saved.map(save => (
      <Saved
        _id={save._id}
        key={save._id}
        title={save.title}
        date={save.date}
        savedDate={save.savedDate}
        url={save.url}
        handleDeleteButton={this.handleDeleteButton}
        getFavoritedArticles={this.getFavoritedArticles}
      />
    ));
  }

  // Keep track of what user types into topic input so that input can be grabbed later
  handleTopicChange = (event) => {
    this.setState({ topic: event.target.value });
  }

  // Keep track of what user types into topic input so that input can be grabbed later
  handleStartYearChange = (event) => {
    this.setState({ startYear: event.target.value });
  }

  // Keep track of what user types into topic input so that input can be grabbed later
  handleEndYearChange = (event) => {
    this.setState({ endYear: event.target.value });
  }

  // When the search form submits, perform NYT api search with user input
  handleFormSubmit = (event) => {
    event.preventDefault()
    console.log("this.state.topic: ", this.state.topic);
    console.log("this.state.startYear: ", this.state.startYear);
    console.log("this.state.endYear: ", this.state.endYear);
    API.searchNYT(this.state.topic, this.state.startYear, this.state.endYear)
      .then((res) => {
        this.setState({ articles: res.data.response.docs });
        console.log("this.state.articles: ", this.state.articles);
      });
  }

  // When save article button is clicked, add article to db
  handleFavoriteButton = (id) => {
    const findArticleByID = this.state.articles.find((el) => el._id === id);
    const newSave = {title: findArticleByID.headline.main, date: findArticleByID.pub_date, url: findArticleByID.web_url, savedDate: Date.now()};
    API.saveArticle(newSave)
    .then(this.getFavoritedArticles());
  }

  // When delete article button is clicked, remove article from db
  handleDeleteButton = (id) => {
    API.deleteArticle(id)
      .then(this.getFavoritedArticles());
  }

  render() {
    return (

      <div className="main-container">
        <div className="container">
          {/* Jumbotron */}
          <div className="jumbotron" style={{backgroundColor: 'green'}}>
            <h1 className="text-center"><strong>New York Times Article Search</strong></h1>
          </div>
          {/* Search Form and Results Section */}
          <Search
            handleTopicChange={this.handleTopicChange}
            handleStartYearChange={this.handleStartYearChange}
            handleEndYearChange={this.handleEndYearChange}
            handleFormSubmit={this.handleFormSubmit}
            createArticleCards={this.createArticleCards}
          />
          {/* Saved Articles Section */}
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title">
                      <center><strong>
                        Saved Articles</strong></center>
                    </h3>
                  </div>
                  <div className="panel-body">
                    <ul className="list-group">
                      {this.showFavorited()}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }

}

export default Main;
