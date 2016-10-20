import Relay from 'react-relay';

export default class DeleteLemonMutation extends Relay.Mutation {
  static fragments = {
    lemon: () => Relay.QL`
      fragment on Lemon {
        id,
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };
  getMutation() {
    console.log('getMutation',  this.props);
    return Relay.QL`mutation{deleteLemon}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteLemonPayload @relay(pattern: true) {
        deletedLemonId,
        viewer,
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'lemons',
      deletedIDFieldName: 'deletedLemonId',
    }];
  }
  
  getVariables() {
    return {
      id: this.props.id,
    };
  }
  // getOptimisticResponse() {
  //   return {
  //     deletedLemonId: this.props.id,
  //     viewer: {id: this.props.viewer.id},
  //   };
  // }
}
