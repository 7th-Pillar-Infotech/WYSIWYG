import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import imageIcon from "@ckeditor/ckeditor5-core/theme/icons/image.svg";
import View from "@ckeditor/ckeditor5-ui/src/view";

class InsertImage extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add("insertImage", (locale) => {
			const view = new FileDialogButtonView(locale);

			view.set({
				label: "Insert image",
				icon: imageIcon,
				tooltip: true,
			});

			view.on("done", (evt, files) => {
				for (const file of Array.from(files)) {
					console.log("Selected file", file);
				}
			});

			// Callback executed once the image is clicked.
			// view.on("execute", () => {
			// 	const imageUrl = prompt("Image URL");

			// 	editor.model.change((writer) => {
			// 		const imageElement = writer.createElement("image", {
			// 			src: imageUrl,
			// 		});

			// 		// Insert the image in the current selection location.
			// 		editor.model.insertContent(
			// 			imageElement,
			// 			editor.model.document.selection
			// 		);
			// 	});
			// });

			return view;
		});
	}
}

export default InsertImage;

class FileDialogButtonView extends View {
	/**
	 * @inheritDoc
	 */
	constructor(locale) {
		super(locale);

		/**
		 * The button view of the component.
		 *
		 * @member {module:ui/button/buttonview~ButtonView}
		 */
		this.buttonView = new ButtonView(locale);

		this.buttonView.set({
			label: "Insert image",
			icon: imageIcon,
			tooltip: true,
		});
		/**
		 * A hidden `<input>` view used to execute file dialog.
		 *
		 * @protected
		 * @member {module:upload/ui/filedialogbuttonview~FileInputView}
		 */
		this._fileInputView = new FileInputView(locale);

		/**
		 * Accepted file types. Can be provided in form of file extensions, media type or one of:
		 * * `audio/*`,
		 * * `video/*`,
		 * * `image/*`.
		 *
		 * @observable
		 * @member {String} #acceptedType
		 */
		this._fileInputView.bind("acceptedType").to(this);

		/**
		 * Indicates if multiple files can be selected. Defaults to `true`.
		 *
		 * @observable
		 * @member {Boolean} #allowMultipleFiles
		 */
		this._fileInputView.bind("allowMultipleFiles").to(this);

		/**
		 * Fired when file dialog is closed with file selected.
		 *
		 *		view.on( 'done', ( evt, files ) => {
		 *			for ( const file of files ) {
		 *				console.log( 'Selected file', file );
		 *			}
		 *		}
		 *
		 * @event done
		 * @param {Array.<File>} files Array of selected files.
		 */
		this._fileInputView.delegate("done").to(this);

		this.setTemplate({
			tag: "span",
			attributes: {
				class: "ck-file-dialog-button",
			},
			children: [this.buttonView, this._fileInputView],
		});

		this.buttonView.on("execute", () => {
			this._fileInputView.open();
		});
	}

	/**
	 * Focuses the {@link #buttonView}.
	 */
	focus() {
		this.buttonView.focus();
	}
}

class FileInputView extends View {
	/**
	 * @inheritDoc
	 */
	constructor(locale) {
		super(locale);

		/**
		 * Accepted file types. Can be provided in form of file extensions, media type or one of:
		 * * `audio/*`,
		 * * `video/*`,
		 * * `image/*`.
		 *
		 * @observable
		 * @member {String} #acceptedType
		 */
		this.set("acceptedType");

		/**
		 * Indicates if multiple files can be selected. Defaults to `false`.
		 *
		 * @observable
		 * @member {Boolean} #allowMultipleFiles
		 */
		this.set("allowMultipleFiles", false);

		const bind = this.bindTemplate;

		this.setTemplate({
			tag: "input",

			attributes: {
				class: ["ck-hidden"],
				type: "file",
				tabindex: "-1",
				accept: bind.to("acceptedType"),
				multiple: bind.to("allowMultipleFiles"),
			},

			on: {
				// Removing from code coverage since we cannot programmatically set input element files.
				change: bind.to(
					/* istanbul ignore next */ () => {
						if (
							this.element &&
							this.element.files &&
							this.element.files.length
						) {
							this.fire("done", this.element.files);
						}

						this.element.value = "";
					}
				),
			},
		});
	}

	/**
	 * Opens file dialog.
	 */
	open() {
		this.element.click();
	}
}
