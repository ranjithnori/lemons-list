/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class Lemon {}
class User {}
class Widget {}

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';

var nextlemonId = 0;

var widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.name = name;
  widget.id = `${i}`;
  return widget;
});

var lemonNames = [
  {firstName: 'Polo', lastName: 'Dev'}, 
  {firstName: 'Vasanth', lastName: 'Sai'}, 
  {firstName: 'Ranjith', lastName: 'Nori'}, 
  {firstName: 'Babu', lastName: 'Pamarthi'}, 
  {firstName: 'Shobha', lastName: 'Potnuru'}, 
];

var lemons = lemonNames.map((lemonName, i) => {
  var lemon = new Lemon();
  lemon.firstName = lemonName.firstName;
  lemon.lastName = lemonName.lastName;
  lemon.id = `${i}`;
  return lemon;
});

module.exports = {
  // Export methods that your schema can use to interact with your database
  addLemon: (firstName, lastName) => {
    // This will add a new lemon object to lemons array.
    const lemon = new Lemon();
    lemon.firstName = firstName;
    lemon.lastName = lastName;
    lemon.id = lemons.length;
    lemons.push(lemon);
    return lemon.id;
  },
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  getLemon: (id) => lemons.find(l => l.id === id),
  getLemons: () => lemons,
  deleteLemon: (id) => {
    console.log('database deleteLemon', id);
    let lemon = lemons.filter(lemon => lemon.id === id)[0];
    let indexOfLemon = lemons.indexOf(lemon);
    console.log('lemons list', lemons);
    if (indexOfLemon !== -1) {
      lemons.splice(indexOfLemon, 1);
    }
    console.log('lemons splced list', lemons);
    return id;
  },
  Lemon,
  User,
  Widget,
};
