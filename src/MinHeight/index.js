import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
class MinHeightPlugin extends Plugin {
	init() {
		const minHeight = this.editor.config.get("minHeight");
		if (minHeight) {
			this.editor.ui.view.editable.extendTemplate({
				attributes: {
					style: {
						minHeight: minHeight,
					},
				},
			});
		}
	}
}

export default MinHeightPlugin;
