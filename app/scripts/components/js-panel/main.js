define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var JsPanelComponent = Base.extend({
    name: 'js-panel'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return JsPanelComponent;
});
