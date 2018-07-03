/**
 * @class  org.ekstep.demo.EditorPlugin
 */
org.ekstep.demo.EditorPlugin = org.ekstep.contenteditor.basePlugin.extend({

    /**
     * @memberOf org.ekstep.demo.EditorPlugin#
     */
    newInstance: function() {
        var props = this.convertToFabric(this.attributes);
        delete this.configManifest;

        var circle = new fabric.Circle({
          radius: 100,
          fill: '#2185D0',
          scaleY: 0.5,
          originX: 'center',
          originY: 'center'
        });

        var text = new fabric.Text('Word worm', {
          fontSize: 30,
          originX: 'center',
          originY: 'center'
        });

        var group = new fabric.Group([ circle, text ], props);
        this.editorObj = group;
    },

    onConfigChange: function(key, value) {
        switch (key) {
            case 'wordText':
                this.attributes.wordText = value;
                break;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },

    getConfig: function() {
        var config = this._super();
        config.wordText = this.attributes.wordText;
        return config;
    }
});
//# sourceURL=demoEditorPlugin.js
