App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {

    let query = {};

    if (this.state.hideCompleted) {
      query = {checked: {$ne: true}}
    }

    return {
      tasks : Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    }
  },

  handleSubmit(event) {
    event.preventDefault();

    let textInput = ReactDOM.findDOMNode(this.refs.textInput);
    let text = textInput.value.trim();

    // Tasks.insert({
    //   text: text,
    //   createdAt: new Date(),
    //   owner: Meteor.userId(),
    //   username: Meteor.user().username
    // });
    Meteor.call("addTask", text);

    textInput.value = "";
  },

  renderTasks() {
    return this.data.tasks.map((task) => {
      const currentUserId = this.data.currentUser &&
              this.data.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return <Task key={task._id}
                  task={task}
                  showPrivateButton={showPrivateButton} />;
    });
  },

  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.data.incompleteCount})</h1>

          <label className="hide-completed">
            <input
                type="checkbox"
                readOnly={true}
                checked={this.state.hideCompleted}
                onClick={this.toggleHideCompleted} />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          { this.data.currentUser ?
          <form className="new-task" onSubmit={this.handleSubmit}>
            <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"/>
            </form> : ''
          }

        </header>
        <ul>
          {this.renderTasks()}
        </ul>

      </div>
    );
  }
});
