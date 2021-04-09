import SelectItem from "./models/selectItem";
import { GqlRequestType } from "./types";
import i18n from "@/plugins/i18n";

export function getContentDispositionName(response: {
  data?: BlobPart;
  headers?;
}) {
  const regex = /filename[^;=\n]*=((['']).*?\2|[^;\n]*)/;
  const matches = regex.exec(response.headers["content-disposition"]);
  let filename = "";

  if (matches != null && matches[1]) {
    filename = matches[1].replace(/\s/g, "").replace(/"/g, "");
  }

  return decodeURI(filename);
}

export function downloadBlob(response: { data: BlobPart }) {
  if (window.navigator.msSaveOrOpenBlob) {
    // IE11
    window.navigator.msSaveOrOpenBlob(
      new Blob([response.data]),
      getContentDispositionName(response)
    );
  } else {
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", getContentDispositionName(response));
    // document.body.appendChild(link);
    link.click();
    // link.remove();
  }
}

/**
 * Pretvara base64 string u File.
 * @param {string} base64String - Ulazni base64 string.
 * @param {string} filename - Ime stvorenog File-a.
 * @param {string} mimeType - Mime type File-a, npr. application/pdf.
 * @return {File} Stvoreni File.
 */
export function base64ToFile(
  base64String: string,
  filename: string,
  mimeType: string
): File {
  const dataUrl = `data:${mimeType};base64,${base64String}`;
  const arr = dataUrl.split(",");
  const bstr = atob(arr[1]);
  let n: number = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mimeType });
}

/**
 * Pretvara file u base64 string.
 * @param {File} file - Ulazni file.
 * @param {string} mimeType - Mime type File-a, npr. application/pdf.
 * @return {File} Stvoreni File.
 */
export function fileToBase64(file: File, mimeType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(new Blob([file]));
    reader.onload = () => {
      const res = reader.result ?? "";
      let encoded = res.toString().replace(/^data:(.*,)?/, "");
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      encoded = `data:${mimeType};base64,${encoded}`;
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}

export function acronym(str: string) {
  return str
    .match(/\b(\w)/g)
    ?.join("")
    .toUpperCase() as string;
}

export function arraysEqual(_arr1, _arr2) {
  if (
    !Array.isArray(_arr1) ||
    !Array.isArray(_arr2) ||
    _arr1.length !== _arr2.length
  ) {
    return false;
  }

  const arr1 = _arr1.concat().sort();
  const arr2 = _arr2.concat().sort();

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function randColorHEX() {
  return rgbToHex(randInt(0, 255), randInt(0, 255), randInt(0, 255));
}

export function randColorRGB() {
  return `rgb(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0, 255)})`;
}

/**
 * Preuzima datoteku navedenu u parametru funkcije na računalo korisnika.
 * @param {File} file - Ulazni file.
 */
export async function download(file: File) {
  const a = document.createElement("a");
  a.href = await fileToBase64(
    file,
    getMimeTypeFromExtension(getExtensionFromFileName(file.name))
  );
  a.download = file.name;
  a.click();
}

/**
 * Vraća extension datoteke preko imena datoteke.
 * @param {string} fileName - Ime datoteke.
 * @return {string} Extension datoteke.
 */
export function getExtensionFromFileName(fileName: string): string {
  return fileName.split(".").pop() as string;
}

/**
 * Vraća mime type datoteke preko extensiona datoteke.
 * @param {string} extension - Extension datoteke.
 * @return {string} Mime type datoteke.
 */
export function getMimeTypeFromExtension(extension: string): string {
  switch (extension.toLowerCase()) {
    case "html":
    case "htm":
    case "shtml":
      return "text/html";
    case "css":
      return "text/css";
    case "xml":
      return "text/xml";
    case "gif":
      return "image/gif";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "js":
      return "application/x-javascript";
    case "atom":
      return "application/atom+xml";
    case "rss":
      return "application/rss+xml";
    case "mml":
      return "text/mathml";
    case "txt":
      return "text/plain";
    case "jad":
      return "text/vnd.sun.j2me.app-descriptor";
    case "wml":
      return "text/vnd.wap.wml";
    case "htc":
      return "text/x-component";
    case "png":
      return "image/png";
    case "tiff":
    case "tif":
      return "image/tiff";
    case "wbmp":
      return "image/vnd.wap.wbmp";
    case "ico":
      return "image/x-icon";
    case "jng":
      return "image/x-jng";
    case "bmp":
      return "image/x-ms-bmp";
    case "svg":
      return "image/svg+xml";
    case "webp":
      return "image/webp";
    case "jar":
    case "war":
    case "ear":
      return "application/java-archive";
    case "hqx":
      return "application/mac-binhex40";
    case "doc":
      return "application/msword";
    case "pdf":
      return "application/pdf";
    case "ps":
    case "eps":
    case "ai":
      return "application/postscript";
    case "rtf":
      return "application/rtf";
    case "xls":
      return "application/vnd.ms-excel";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "wmlc":
      return "application/vnd.wap.wmlc";
    case "kml":
      return "application/vnd.google-earth.kml+xml";
    case "kmz":
      return "application/vnd.google-earth.kmz";
    case "7z":
      return "application/x-7z-compressed";
    case "cco":
      return "application/x-cocoa";
    case "jardiff":
      return "application/x-java-archive-diff";
    case "jnlp":
      return "application/x-java-jnlp-file";
    case "run":
      return "application/x-makeself";
    case "pl":
    case "pm":
      return "application/x-perl";
    case "prc":
    case "pdb":
      return "application/x-pilot";
    case "rar":
      return "application/x-rar-compressed";
    case "rpm":
      return "application/x-redhat-package-manager";
    case "sea":
      return "application/x-sea";
    case "swf":
      return "application/x-shockwave-flash";
    case "sit":
      return "application/x-stuffit";
    case "tcl":
    case "tk":
      return "application/x-tcl";
    case "der":
    case "pem":
    case "crt":
      return "application/x-x509-ca-cert";
    case "xpi":
      return "application/x-xpinstall";
    case "xhtml":
      return "application/xhtml+xml";
    case "zip":
      return "application/zip";
    default:
      return "application/pdf";
  }
}

export function formatDecimal(value, options?: Intl.NumberFormatOptions) {
  if (typeof value !== "number") {
    return value;
  }

  const formatter = new Intl.NumberFormat("hr-HR", {
    style: "decimal",
    minimumFractionDigits:
      options?.minimumFractionDigits !== undefined
        ? options.minimumFractionDigits
        : 2,
    maximumFractionDigits:
      options?.maximumFractionDigits !== undefined
        ? options.maximumFractionDigits
        : 3,
    useGrouping: options?.useGrouping !== undefined ? options.useGrouping : true
  });

  return formatter.format(value);
}

interface GqlRequestParam {
  name: string;
  quoted?: boolean;
  value?: any;
  subFields?: GqlRequestParam[];
}

interface GqlResponseParam {
  name: string;
  subFields?: Array<string | GqlResponseParam>;
}

interface GqlRequest {
  type: GqlRequestType;
  name: string;
  responseParams?: Array<string | GqlResponseParam>;
  requestParams?: GqlRequestParam[];
}

export function formatRequestParam(param: GqlRequestParam): string {
  if (!param.subFields) {
    return `${param.name}: ${
      param.quoted !== undefined && param.quoted == true
        ? `"${param.value}"`
        : param.value
    }`;
  } else {
    return `${param.name}: { ${param?.subFields?.map(x =>
      formatRequestParam(x)
    )} }`;
  }
}

export function formatResponseParam(param: GqlResponseParam): string {
  if (typeof param == "string") {
    return param;
  } else {
    return `${param.name} { ${param?.subFields?.map(x =>
      formatResponseParam(x as GqlResponseParam)
    )} }`;
  }
}

export function formatGqlRequest({
  type,
  name,
  responseParams,
  requestParams
}: GqlRequest): string {
  const requestParamsFormatted = requestParams
    ? `(${requestParams.map(x => formatRequestParam(x))})`
    : "";
  const responseParamsFormatted = responseParams
    ? `{ ${responseParams.map(x => {
        if (typeof x == "string") {
          return x;
        }
        return formatResponseParam(x);
      })} }`
    : "";
  return `${type} { ${name}${requestParamsFormatted} ${responseParamsFormatted} }`;
}

export function formatCurrencyDisplay(
  visible: boolean,
  val: number,
  currency: string
): string {
  return visible
    ? `${val.toLocaleString("en")} ${currency}`
    : `${val} ${currency}`.replace(/[0-9]/gi, "*");
}

export function adjustHexColor(color: string, amount: number): string {
  return color
    .replace(/^#/, "")
    .replace(/../g, color =>
      (
        "0" +
        Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
      ).substr(-2)
    );
}

export function createSelectFromEnum<T>(translationPrefix: string, enumType: T) {
  const objectTypes: SelectItem[] = [];

  const names = Object.keys(enumType).filter((item) => {       
    return isNaN(Number(item));
  });

  names.forEach(item => {
    objectTypes.push({
      text: String(i18n.t(translationPrefix + "." + item)),
      value: enumType[item]
    });
  });

  return objectTypes;
}