export default class UploadAdapterImplementation {
    constructor(loader, uploadUrl, useFetch, headers, t) {
        this.loader = loader;
        this.uploadUrl = uploadUrl;
        this.useFetch = useFetch && window.fetch;
        this.headers = headers;
        this.t = t;
    }

    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                this.genericErrorText = "Couldn\'t upload file: " + file.name + ".";

                this.data = new FormData();
                this.data.append('upload', file);

                if (this.useFetch) {
                    this._fetchRequest(resolve, reject);
                }
                else {
                    this._xhrRequest(resolve, reject); 
                }
            }));
    }

    abort() {
        if (this.useFetch) {
            if (this.abortController) {
                this.abortController.abort();
            }
        }
        else {
            if (this.xhr) {
                this.xhr.abort();
            }
        }
    }

    _fetchRequest(resolve, reject) {
        this.abortController = new AbortController();

        fetch(this.uploadUrl, {
            signal: this.abortController.signal,
            method: 'POST',
            headers: this.headers || {},
            body: this.data
        })
            .then(response => {
                return response.json();
            })
            .then(json => {
                resolve({
                    default: json.url
                });
            })
            .catch(error => {
                if (error.name === "AbortError") {
                    return reject();
                }

                return reject("ERROR Uploading : " + (error || this.genericErrorText));
            });
    }

    _xhrRequest(resolve, reject) {
        console.log("_xhrRequest");
        this.xhr = new XMLHttpRequest();
        this.xhr.open('post', this.uploadUrl, true);
        this.xhr.responseType = 'json';

        this.xhr.addEventListener('error', () => reject(this.genericErrorText));
        this.xhr.addEventListener('abort', () => reject());
        this.xhr.addEventListener('load', () => {
            const response = this.xhr.response;

            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : this.genericErrorText);
            }

            resolve({
                default: response.url 
            });
        });

        if (this.xhr.upload) {
            this.xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    this.loader.uploadTotal = evt.total;
                    this.loader.uploaded = evt.loaded;
                }
            });
        }

        if (this.headers) {
            var headers = Object.keys(this.headers);
            for (var h = 0; h < headers.length; h++) {
                this.xhr.setRequestHeader(headers[h], this.headers[headers[h]]);
            }
        }
        this.xhr.send(this.data);
    }
}
