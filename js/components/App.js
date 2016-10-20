import React from 'react';
import Relay from 'react-relay';

import AddLemonMutation from '../mutations/AddLemonMutation';
import DeleteLemonMutation from '../mutations/DeleteLemonMutation';

class App extends React.Component {
  
  state = {
    firstName: '',
    lastName: ''
  };

  deleteLemon = (id) => {
    console.log('deleteLemon', id, this.props.viewer.id);
    Relay.Store.commitUpdate(
      new DeleteLemonMutation({id, viewer: this.props.viewer.id})
    );    
  }

  addLemon = (e) => {
    e.preventDefault();
    var lemon = {
      firstName: this.refs.firstName.value,
      lastName: this.refs.lastName.value
    };
    lemon.viewer= this.props.viewer;

    console.log('lemon', lemon);
    this.setState(lemon, function(){
      Relay.Store.commitUpdate(new AddLemonMutation(lemon));
    });
  }

  render() {
    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.viewer.widgets.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.name} (ID: {edge.node.id})</li>
          )}
        </ul>
        <h1>Lemons list</h1>
        <ul>
          {this.props.viewer.lemons.edges.map(edge =>
            <li key={edge.node.id}>
              First Name: {edge.node.firstName} (Last Name: {edge.node.lastName})
              <button onClick={() => {
                this.deleteLemon(edge.node.id)
              }}>Delete</button>
            </li>
          )}
        </ul>
        <form onSubmit={this.addLemon}>
          <input type="text" ref="firstName" placeholder="First Name" />
          <input type="text" ref="lastName" placeholder="Last Name" />
          <input type="submit"/>
        </form>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        widgets(first: 10) {
          edges {
            node {
              id,
              name,
            },
          },
        },
        lemons(first: 20){
          edges{
            node{
              id,
              firstName,
              lastName
            }
          }
        },
        ${AddLemonMutation.getFragment('viewer')},
        ${DeleteLemonMutation.getFragment('viewer')},
      }
    `,
  },
});
