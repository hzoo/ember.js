import run from 'ember-metal/run_loop';
import EmberView from 'ember-views/views/view';
import compile from 'ember-template-compiler/system/compile';
import { runAppend, runDestroy } from "ember-runtime/tests/utils";

import { set } from 'ember-metal/property_set';

var view;

QUnit.module('ember-htmlbars: destroy-element-hook tests', {
  teardown() {
    runDestroy(view);
  }
});

QUnit.test('can properly re-render an if/else with attribute morphs', function(assert) {
  var done = assert.async();

  view = EmberView.create({
    switch: true,

    template: compile(`
     {{~#if view.switch~}}
       {{~#view}}Truthy{{/view~}}
     {{~/if~}}
    `)
  });

  runAppend(view);

  assert.equal(view.$().text(), 'Truthy', 'precond - truthy template is displayed');
  assert.equal(view.get('childViews.length'), 1);

  run.later(function() {
    set(view, 'switch', false);

    run.later(function() {
      assert.equal(view.$().text(), '', 'truthy template is removed');
      assert.equal(view.get('childViews.length'), 0);

      done();
    });
  });
});
