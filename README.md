# ckeditor5-upload-adapter

ckeditor5-upload-adapter is a 3. party free upload adapter for CKEditor 5 that also supports CSRF prevention then uploading images.

If you want to upload images in CKEditor 5, you have the following options : 
* Pay for a commercial upload adapter (CKFinder or EasyImage)
* Use a free 3. party upload adapter (such as ckeditor5-upload-adapter)
* Roll your own upload adapter


Full ckeditor5-upload-adapter official documentation here : [How to custom build CKEditor 5 with image upload support](https://topiqs.online/1120).
<br />The full documentation also contains step-by-step creation of editor, http endpoint and CSRF prevention.
<br />Below is a short usage documentation. 

//#1 : In your CKEditor5 build file REMOVE any reference to CKFinder & EasyImage and ADD references to ckeditor5-upload-adapter:

```javaqscript
// app.js

import AutoformatPlugin from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
//import UploadAdapterPlugin from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter'; // Remove this if it exists
//import CKFinderPlugin from '@ckeditor/ckeditor5-ckfinder/src/ckfinder'; // Remove this if it exists
//import EasyImagePlugin from '@ckeditor/ckeditor5-easy-image/src/easyimage'; // Remove this if it exists
import UploadAdapterPlugin from 'ckeditor5-upload-adapter'; // Add this
// ...

ClassicEditor.builtinPlugins = [
    EssentialsPlugin,
    AutoformatPlugin,
    BoldPlugin,
    ItalicPlugin,
    BlockQuotePlugin,
    //UploadAdapterPlugin, // Remove this if it exists
    //CKFinderPlugin, // Remove this if it exists
    //EasyImagePlugin, // Remove this if it exists
    ImagePlugin,
    ImageUploadPlugin,
    UploadAdapterPlugin // Add this (the exported classname from ckeditor5-upload-adapter, UploadAdapterPlugin, is the same as from ckeditor5-adapter-ckfinder, however the source files are different)
    // ...
]
```

<br />//#2 : Then creating the CKEditor5 set the UploadAdapterPlugin uploadUrl (mandatory) & any headers (optional) :

```javaqscript
ClassicEditor.create(document.querySelector('#editor'), {
    uploadAdapter: {
        uploadUrl: '/home/ImageUpload', // url to server-side http endpoint // mandatory
        headers : { "headerKey1": "headerValue1", "headerKey2", "headerValue2" } // optional. Eg. in asp.net core for CSRF prevention you would have headers : { "RequestVerificationToken": _serverSideGeneratedCSRFToken }
    }
        // ...
});
```

<br />//#3 : Create a server-side http endpoint to which the file (eg. image) is uploaded :

// Http endpoint example in asp.net core c# :
<br />(full code example available in official documentation : [How to custom build CKEditor 5 with image upload support](https://topiqs.online/1120))
```javaqscript
[HttpPost]
public JsonResult ImageUpload(IFormFile file)
{
	string error = "";

	// do your stuff with the file

	if (error)
	{
		return Json(new
		{
			uploaded = false,
			error = error
		});
	}
	else
	{
		return Json(new
		{
			uploaded = true,
			url = imageServerUrl
		});
	}
}
```
