/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Widget,
  addLemon,
  deleteLemon,
  editLemon,
  getUser,
  getViewer,
  getLemon,
  getLemons,
  getWidget,
  getWidgets,
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Widget') {
      return getWidget(id);
    } else if (type === 'Lemon') {
      return getLemon(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Widget)  {
      return widgetType;
    } else if (obj instanceof Lemon)  {
      return lemonType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    widgets: {
      type: widgetConnection,
      description: 'A person\'s collection of widgets',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getWidgets(), args),
    },
    lemons: {
      type: lemonConnection,
      description: 'A person\'s displayed list of lemons',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getLemons(), args),
    },
  }),
  interfaces: [nodeInterface],
});

var widgetType = new GraphQLObjectType({
  name: 'Widget',
  description: 'A shiny widget',
  fields: () => ({
    id: globalIdField('Widget'),
    name: {
      type: GraphQLString,
      description: 'The name of the widget',
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {connectionType: widgetConnection} =
  connectionDefinitions({name: 'Widget', nodeType: widgetType});

var lemonType = new GraphQLObjectType({
  name: 'Lemon',
  description: 'A member of iB',
  fields: () => ({
    id: globalIdField('Lemon'),
    firstName: {
      type: GraphQLString,
      description: 'The first name of the Lemon',
    },
    lastName: {
      type: GraphQLString,
      description: 'The last name of the Lemon',
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {connectionType: lemonConnection, edgeType: GraphQLLemonEdge} =
  connectionDefinitions({name: 'Lemon', nodeType: lemonType});


/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  }),
});


const GraphQLAddLemonMutation = mutationWithClientMutationId({
  name: 'AddLemon',
  inputFields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    lemonEdge: {
      type: GraphQLLemonEdge,
      resolve: ({localLemonId}) => {
        const lemon = getLemon(localLemonId);
        return {
          cursor: cursorForObjectInConnection(getLemons(), lemon),
          node: lemon,
        };
      },
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({firstName, lastName}) => {
    const localLemonId = addLemon(firstName, lastName);
    return {localLemonId};
  },
});

const GraphQLEditLemonMutation = mutationWithClientMutationId({
  name: 'EditLemon',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    lemonEdge: {
      type: GraphQLLemonEdge,
      resolve: ({localLemonId}) => {
        const lemon = getLemon(localLemonId);
        return {
          cursor: cursorForObjectInConnection(getLemons(), lemon),
          node: lemon,
        };
      },
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id, firstName, lastName}) => {

    const localLemonId = fromGlobalId(id).id;
    editLemon(localLemonId, firstName, lastName);
    
    return {localLemonId};
  },
});




const GraphQLDeleteLemonMutation = mutationWithClientMutationId({
  name: 'DeleteLemon',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    deletedLemonId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const localLemonId = fromGlobalId(id).id;
    console.log('mutateAndGetPayload', localLemonId);
    deleteLemon(localLemonId);
    return {id};
  },
});


/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
    addLemon: GraphQLAddLemonMutation,
    editLemon: GraphQLEditLemonMutation,
    deleteLemon: GraphQLDeleteLemonMutation
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  mutation: mutationType
});
