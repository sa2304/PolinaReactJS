import React, { Component } from 'react';
import $ from 'jquery';
import logo from './logo.svg';
import './App.css';

///////////////////////////////////////////////////////////////////////////////
class PageHeader extends Component {
	//-------------------------------------------------------------------------
	render() {
		return (
			<div className="page-header">
				<span className="title"><h1>{this.props.title}</h1></span>
				<span><SearchBar /></span>
			</div>
		);
	}
}

///////////////////////////////////////////////////////////////////////////////
class SearchBar extends Component {
	render() {
		return (
			<input type="text" name="search" id="search-bar" placeholder="Search" />
		);
	}
}

///////////////////////////////////////////////////////////////////////////////
class Sidebar extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			items: null,
		};
	}
	
	componentDidMount() {
		$.ajax({
			url: "https://www.googleapis.com/blogger/v3/blogs/1577292527436988339/posts?key=" + this.props.API_KEY,
			dataType: 'json',
			cache: false,
			success: function(data) {
				const items = data.items.map((item) => <li>{item.title}</li>);
				this.setState({
					data: data, 
					items: items 
				});
			}.bind(this),
			error: function(vhx, status, err) {
					console.error(this.props.blogUrl, status, err.toString());
			}.bind(this),
		});
	}
	
	render() {
		return (
		  <div id="sidebar">
		    <ul id="sidebar-items">
			{this.state.items}
			</ul>
		  </div>
		);
	}
}

///////////////////////////////////////////////////////////////////////////////
class Toolbar extends Component {
	render() {
		return (
			<ul className="toolbar-tag-links">
				<li>Tag 1</li>
				<li>Tag 2</li>
				<li>Tag 3</li>
			</ul>
		);
	}
}

///////////////////////////////////////////////////////////////////////////////
class PageContent extends Component {
	componentDidMount() {
		console.log("PageContent did mount");
		
		if (this.props.posts) {
			$.ajax({
				url: this.props.posts.selfLink + "?key=" + this.props.API_KEY,
				dataType: 'json',
				cache: false,
			  
				success: function(data) {
					console.log("PageContent ajax loaded");
					
				  this.setState({
					  data: data,
				  });
				}.bind(this),
				  
				error: function(vhx, status, err) {
					console.error(this.props.blogUrl, status, err.toString());
				}.bind(this),
			});
		}
	}
	
	render() {
		console.log("PageContent rendered");
		
		return (
		  <div id="page-content">
			<Sidebar API_KEY={this.props.API_KEY} />
			<PostDisplay />
		  </div>
		);
	}
}

///////////////////////////////////////////////////////////////////////////////
class PostDisplay extends Component {
	render() {
		return (
			<div id="post-display"></div>
		);
	}
}

///////////////////////////////////////////////////////////////////////////////
class Footer extends Component {
	render() {
		return (
			<div id="footer">Blog footer</div>
		);
	}
}

///////////////////////////////////////////////////////////////////////////////
class App extends Component {
	/*
  constructor(props) {
	  super(props);
	  this.state = { blogUrl: 'http://sa2304.blogspot.ru' };
  }
  */
	
  render() {
    return (
      <div className="App">
		<Blog API_KEY={process.env.REACT_APP_API_KEY} blogUrl="http://sa2304.blogspot.ru" />
      </div>
    );
  }
}


class Blog extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			data: null,
		}
	}
	
	//-------------------------------------------
	componentDidMount() {
		console.log("Blog did mount");
		
		$.ajax({
		  url: "https://www.googleapis.com/blogger/v3/blogs/byurl?" +
			"key=" + this.props.API_KEY + "&" +
			"url="+this.props.blogUrl,
		  dataType: 'json',
	      cache: false,
		  
		  success: function(data) {
			  console.log("Blog ajax loaded");
			  
			  this.setState({ data: data });
			  
			  //TODO: Update child components?
		  }.bind(this),
		  
		  error: function(vhx, status, err) {
			  console.error(this.props.blogUrl, status, err.toString());
		  }.bind(this),
		});
	}
	
	//--------------------------------------
	render() {
		console.log("Blog rendered");
		var title = "";
		var posts;
		if (this.state.data) {
			title = this.state.data.name;
			posts = this.state.data.posts;
		}
		
		return (
		<div className="blog">
		  <PageHeader title={title} />
		  <PageContent posts={posts} API_KEY={this.props.API_KEY} />
		</div>
		);
	}
}

export default App;