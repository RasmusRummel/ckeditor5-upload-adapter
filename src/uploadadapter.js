import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

import UploadAdapterImplementation from './uploadadapterimplementation';

export default class UploadAdapter extends Plugin {
    static get requires() {
        return [FileRepository];
    }

    init() {
        const uploadUrl = this.editor.config.get('uploadAdapter.uploadUrl');
        const useFetch = this.editor.config.get('uploadAdapter.useFetch');
        const headers = this.editor.config.get('uploadAdapter.headers');
        const t = this.editor.t;

        if (!uploadUrl) {
            console.warn('CKPro UploadAdapter : uploadUrl is not defined.');
            return;
        }

        this.editor.plugins.get('FileRepository').createUploadAdapter = (fileLoader) => {
            return new UploadAdapterImplementation(fileLoader, uploadUrl, useFetch, headers, t);
        };
    }
}
