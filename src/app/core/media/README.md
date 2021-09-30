# Media gallery
This media gallery is a little bit ducktaped, so ****be careful while modifying it****.

Most important thing you have to remember is that upload tracks progress basing on ****file index in upload array****
so you must make sure to give corrent index to UI. I had to map that in media-upload-helper.

It's my first ever created media library with uploading and full media management so it's far from perfect.

> It's abstraction on abstraction on abstraction

## Abstraction layers
* Components
* `media-upload-helper.service.ts` and `media-browse-helper.service.ts`
* `firebase-storage.service.ts` and `multiple-files-upload-task.ts`
* AngularFire services
* ...
* Firebase SDK
* XHR or Fetch API
* V8
* Idk some browser calls
* low-level browser code
* Machine code
* Syscalls
* Hardware
* Electricity
* Electrons
* Fucking quantum physics
