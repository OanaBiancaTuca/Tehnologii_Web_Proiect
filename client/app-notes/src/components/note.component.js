import React, { Component } from "react";
import NoteDataService from "../services/note.service";
import "./note.component.css";

export default class Note extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeContent = this.onChangeContent.bind(this);
    this.getNote = this.getNote.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);

    this.state = {
      currentNote: {
        id: null,
        title: "",
        content: "",
        published: false
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getNote(this.props.match.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentNote: {
          ...prevState.currentNote,
          title: title
        }
      };
    });
  }

  onChangeContent(e) {
    const content = e.target.value;
    
    this.setState(prevState => ({
      currentNote: {
        ...prevState.currentNote,
        content: content
      }
    }));
  }

  getNote(id) {
    NoteDataService.get(id)
      .then(response => {
        this.setState({
          currentNote: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentNote.id,
      title: this.state.currentNote.title,
      content: this.state.currentNote.content,
      published: status
    };

    NoteDataService.update(this.state.currentNote.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentNote: {
            ...prevState.currentNote,
            published: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateNote() {
    NoteDataService.update(
      this.state.currentNote.id,
      this.state.currentNote
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The note was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteNote() {    
    NoteDataService.delete(this.state.currentNote.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/notes')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    // ...
    const {currentNote}=this.state;
    return (
        <div>
          {currentNote ? (
            <div className="edit-form">
              <h4>Note</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentNote.title}
                    onChange={this.onChangeTitle}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="content">Content</label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="content"
                    value={currentNote.content}
                    onChange={this.onChangeContent}
                  />
                </div>
  
                <div className="form-group">
                  <label>
                    <strong>Status:</strong>
                  </label>
                  {currentNote.published ? "Published" : "Pending"}
                </div>
              </form>
  
              {currentNote.published ? (
                <button
                  id="btnUnPublish"
                  className="badge badge-primary mr-2"
                  onClick={() => this.updatePublished(false)}
                >
                  UnPublish
                </button>
              ) : (
                <button
                id="btnPublish"
                  className="badge badge-primary mr-2"
                  onClick={() => this.updatePublished(true)}
                >
                  Publish
                </button>
              )}
  
              <button
                id="btnDelete"
                className="badge badge-danger mr-2"
                onClick={this.deleteNote}
              >
                Delete
              </button>
  
              <button
              
                id="btnUpdate"
                type="submit"
                className="badge badge-success"
                onClick={this.updateNote}
              >
                Update
              </button>
              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Note...</p>
            </div>
          )}
        </div>
      );
  }
}