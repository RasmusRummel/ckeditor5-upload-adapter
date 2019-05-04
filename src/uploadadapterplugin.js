import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

import UploadAdapter from './uploadadapter';

export default class UploadAdapterPlugin extends Plugin {
    static get requires() {
        return [FileRepository];
    }

    init() {
        const uploadUrl = this.editor.config.get('uploadAdapter.uploadUrl');
        const headers = this.editor.config.get('uploadAdapter.headers');
        const t = this.editor.t;

        if (!uploadUrl) {
            console.warn('CKEditor5 FileAdapter : uploadUrl is not defined.');
            return;
        }

        this.editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new UploadAdapter(loader, uploadUrl, headers, t);
        };
    }
}
