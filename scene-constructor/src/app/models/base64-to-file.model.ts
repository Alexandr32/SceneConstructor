

/**
   * Хз как это работает
   * https://coderoad.ru/61041916/%D0%92%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D1%82-
   * %D1%84%D0%B0%D0%B9%D0%BB%D0%B0-%D0%B8%D0%B7-ngx-image-cropper-%D0%B2-upload-Angular
   * @param data
   * @param filename
   * @private
   */
export function base64ToFile(data, filename): File {

  const arr = data.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}


export function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, rejects) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.toString())
    reader.onerror = error => rejects(error)
  })
}
