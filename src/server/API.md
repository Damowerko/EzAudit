## Backend api

Important notes:
* Form files must have a fieldname `file` (even for multiple files).

### GET /api/file
Gell all files data

### POST /api/file
Body should contain multipart files from multipart form. An array of file metadata.


### GET /api/file/FILE_ID
Download the file. Server will send it as an attachment.

### PUT /api/file/FILE_ID
Replace the file.

### PUT/GET /api/file/metadata/FILE_ID
Set or get the metadata for a file. Will replace all metadata. Metadata is received/sent in JSON
format in the body.