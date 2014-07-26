define([

  'jquery'
  ,'underscore'
  ,'backbone'

  ,'src/constants'
  ,'src/utils'

], function (

  $
  ,_
  ,Backbone

  ,constant
  ,util

) {

  var $win = $(window);

  return Backbone.View.extend({

    'events': {
      'mousedown .rotation-control': 'onMousedownRotationControl'
    }

    /**
     * @param {Object} opts
     *   @param {Stylie} stylie
     *   @param {jQuery} $container
     */
    ,'initialize': function (opts) {
      this.stylie = opts.stylie;
      this.$container = opts.$container;
      this.$el.dragon({
        'within': this.$container
        ,'dragStart': _.bind(this.dragStart, this)
        ,'dragEnd': _.bind(this.dragEnd, this)
      });

      this._$crosshairContainer = this.$el.find('.crosshair-container');
      this._$cubelet = this.$el.find('.rotation-control');
      this._$cubelet
        .hide()
        .cubeletInit()
        .cubeletApplyRotationToElement(this._$crosshairContainer);

      this._$cubelet.on('change', _.bind(this.onCubeletChange, this));

      this.listenTo(this.stylie, constant.ROTATION_MODE_START,
          _.bind(this.onRotationModeStart, this));
      this.listenTo(this.stylie, constant.ROTATION_MODE_STOP,
          _.bind(this.onRotationModeStop, this));

      this.listenTo(this.model, 'change', _.bind(this.render, this));
      this.listenTo(this.model, 'destroy', _.bind(this.tearDown, this));

      this.render();
    }

    ,'onMousedownRotationControl': function (evt) {
      evt.stopPropagation();
    }

    ,'onRotationModeStart': function () {
      this._$cubelet.show();
    }

    ,'onRotationModeStop': function () {
      this._$cubelet.hide();
      this.stylie.trigger(constant.UPDATE_CSS_OUTPUT);
    }

    ,'onCubeletChange': function () {
      this.updateModel();
      this._$cubelet.cubeletApplyRotationToElement(this._$crosshairContainer);
    }

    ,'dragStart': function (evt, ui) {
      this.dimPathLine();
    }

    ,'dragEnd': function (evt, ui) {
      this.updateModel();
      this.stylie.trigger(constant.UPDATE_CSS_OUTPUT);
    }

    ,'render': function () {
      this.$el.css({
        'left': this.model.get('x') + 'px'
        ,'top': this.model.get('y') + 'px'
      });
      var rotationCoords = this._$cubelet.cubeletGetCoords();
      this._$cubelet.cubeletSetCoords({
        'x': this.model.get('rX')
        ,'y': this.model.get('rY')
        ,'z': this.model.get('rZ')
      });
      this._$cubelet.cubeletApplyRotationToElement(this._$crosshairContainer);
    }

    ,'updateModel': function () {
      var rotationCoords = this._$cubelet.cubeletGetCoords();
      var pxTo = util.pxToNumber;
      this.model.set({
        'x': pxTo(this.$el.css('left'))
        ,'y': pxTo(this.$el.css('top'))
        ,'rX': rotationCoords.x
        ,'rY': rotationCoords.y
        ,'rZ': rotationCoords.z
      });
      this.stylie.trigger(constant.PATH_CHANGED);
      this.model.trigger('change');
      this.stylie.rekapi.update();
    }

    ,'dimPathLine': function () {
      this.stylie.view.canvas.backgroundView.update(true);
    }

    ,'tearDown': function () {
      this._$crosshairContainer.remove();
      this._$cubelet.remove();
      this.remove();
      this.stopListening();
      _.empty(this);
    }

  });

});