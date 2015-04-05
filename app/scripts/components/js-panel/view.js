define([

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var JsPanelComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      timelineModified: function () {
        if (this.$el.is(':visible')) {
          this.renderJs();
        }
      }

      /**
       * @param {jQuery} $shownContent
       */
      ,tabShown: function ($shownContent) {
        if ($shownContent.is(this.$el)) {
          this.renderJs();
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    ,deferredInitialize: function () {
      this.renderJs();
    }

    ,renderJs: function () {
      var exportString = JSON.stringify(this.lateralus.getJsExport(), null, 2);
      this.$generatedJs.val(exportString);
    }
  });

  return JsPanelComponentView;
});
