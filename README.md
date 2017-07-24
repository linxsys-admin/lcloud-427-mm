# AWS S3 CLI

App works on `lcloud-427-mm` by default.
Set `BUCKET_NAME` ENV variable to use another bucket.

## Examples

### Lists all files in a bucket

```sh
node lcloud-mm list
```

### Upload a local file to the bucket

```sh
node lcloud-mm upload [filepath] [target]
```

### Lists files that match a regex

```sh
node lcloud-mm list --filter [regex]
```

### Delete all files matching a regex

```sh
node lcloud-mm delete [regex]
```
