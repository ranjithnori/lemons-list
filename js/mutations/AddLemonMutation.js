import Relay from 'react-relay';

export default class AddLemonMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };
  getMutation() {

    console.log('getMutation', this.props);
    return Relay.QL`mutation{addLemon}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddLemonPayload @relay(pattern: true) {
        lemonEdge,
        viewer {
          lemons,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'lemons',
      edgeName: 'lemonEdge',
      rangeBehaviors: () => {
        return 'append';
      },
    }];
  }
  getVariables() {
    return {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
    };
  }
  getOptimisticResponse() {
    return {
      // FIXME: totalCount gets updated optimistically, but this edge does not
      // get added until the server responds
      lemonEdge: {
        node: {
          firstName: this.props.firstName,
          lastName: this.props.lastName,
        },
      },
      viewer: {
        id: this.props.viewer.id,
      },
    };
  }
}