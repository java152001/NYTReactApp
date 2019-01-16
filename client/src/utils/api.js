import axios from "axios";
require('dotenv').config();

const api = {
  // Query NYT API 
  searchNYT: function(topic, start, end) {
    const authKey = "KRcvrq7fcxIWLhfoUmDzG6aKfgFq9AtW";
    const queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
    authKey + "&q=" + topic + "&begin_date=" + start + "0101&end_date=" + end + "0101";
    return axios.get(queryURL);
  },
  // Retrieves saved articles from the db
  getArticle: function() {
    return axios.get("/api/saved");
  },
  // Saves a new article to the db
  saveArticle: function(articleObj) {
    return axios.post("/api/saved", articleObj);
  },
  // Deletes an article from the db
  deleteArticle: function(id) {
    return axios.delete(`/api/saved/${id}`);
  }
};

export default api;
