import React, { Component } from "react";
import NoteDataService from "../services/note.service";
import { Link } from "react-router-dom";
import "./notes-list.component.css"

export default class NotesList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveNotes = this.retrieveNotes.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveNote = this.setActiveNote.bind(this);
    this.removeAllNotes= this.removeAllNotes.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      notes: [],
      currentNote: null,
      currentIndex: -1,
      searchTitle: ""
    };
  }

  componentDidMount() {
    this.retrieveNotes();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  retrieveNotes() {
    NoteDataService.getAll()
      .then(response => {
        this.setState({
          notes: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveNotes();
    this.setState({
      currentNote: null,
      currentIndex: -1
    });
  }

  setActiveNote(note, index) {
    this.setState({
      currentNote: note,
      currentIndex: index
    });
  }

  removeAllNotes() {
    NoteDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

 
  searchTitle() {
    this.setState({
      currentNote: null,
      currentIndex: -1
    });

    NoteDataService.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({
          notes: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    
    const { searchTitle, notes, currentNote, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Notes List</h4>

          <ul className="list-group">
            {notes &&
              notes.map((note, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveNote(note, index)}
                  key={index}
                >
                  {note.title}
                </li>
              ))}
          </ul>

          <button id="button1"
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllNotes}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentNote ? (
            <div>
              <h4>Note</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentNote.title}
              </div>
              <div>
                <label>
                  <strong>Content:</strong>
                </label>{" "}
                {currentNote.content}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentNote.published ? "Published" : "Pending"}
              </div>

              <Link id="linkEdit"
                to={"/notes/" + currentNote.id}
                className="badge badge-warning"
              >
                Edit
              </Link>

              
              <Link id="linkEdit"
                to={"/files"}
                className="badge badge-warning"
              >
                Upload File
              </Link>
            </div>

            
          ) : (
            <div>
              <br />
              <p>Please click on a Note...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
  
