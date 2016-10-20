import Relay from 'react-relay';

export default class EditLemonMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        lemons(first: 20){
          edges{
            node{
              id,
              firstName,
              lastName
            }
          }
        },
      }
    `,
  };
  
  getMutation() {
    console.log('getMutation',  this.props);
    return Relay.QL`mutation{editLemon}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on EditLemonPayload @relay(pattern: true) {
        viewer
      }
    `;
  }
  
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }];
  }

  getVariables() {
    return {
      id: this.props.id,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
    };
  }

  // getOptimisticResponse() {
  //   return {
  //     deletedLemonId: this.props.lemon.id,
  //     viewer: {id: this.props.viewer.id},
  //   };
  // }
}
