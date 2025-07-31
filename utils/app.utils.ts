import qs from 'qs';
import toastNotifications from './toastNotifications.utils';

export const resolveUrl = (url: string, queryParams?: any) => {
  const queryString = qs.stringify(queryParams).replaceAll('%2B', ' ');

  return `${url}${queryString ? `?${queryString}` : ``}`;
};

export const parseQueryParams = (queryString: string) => {
  return qs.parse(queryString, {
    decoder: (str: string) => {
      // First decode URL encoding (converts %20 to spaces, %2B to +, etc.)
      const decodedStr = decodeURIComponent(str);

      // Convert + characters to spaces (since + represents spaces in URL encoding)
      const finalStr = decodedStr.replace(/\+/g, ' ');

      // Handle special cases like 'true' and numbers
      if (finalStr === 'true') return true;
      if (finalStr === 'false') return false;
      if (!isNaN(Number(finalStr))) return Number(finalStr);
      return finalStr;
    },
  });
};

export const copyToClipboard = (textToCopy: string, label: string = 'Text copied to clipboard.') => {
  navigator.clipboard.writeText(textToCopy).then(() => {
    toastNotifications.success(label);
  });
};

export const getStorageUrl = (path: string) => {
  if (!path) {
    return;
  }

  return `${import.meta.env.VITE_SUPABASE_PUBLIC_URL}/${path}`;
}

export const openInNewTab = (url: string) => {
  var win = window.open(url, '_blank');
  win?.focus();
}

export function base64ToBlob(base64: string, contentType = "",
  sliceSize = 512) {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length;
    offset += sliceSize) {
    const slice = byteCharacters.slice(
      offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}