export default class UploadAdapter {
    constructor(loader, uploadUrl, csrfToken, t) {
        this.loader = loader;
        this.uploadUrl = uploadUrl;
        this.csrfToken = csrfToken;
        this.t = t;
    }

    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }    
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open('post', this.uploadUrl, true);
        xhr.responseType = 'json';
    }

    _initListeners(resolve, reject, file ) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = 'Couldn\'t upload file: ${ file.name }.';

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;

            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }

            resolve({
                default: response.url
            });
        });
    }

    _sendRequest(file) {
        const data = new FormData();
        data.append('upload', file);
        this.xhr.setRequestHeader('RequestVerificationToken', this.csrfToken);

        this.xhr.send(data);
    }
}
